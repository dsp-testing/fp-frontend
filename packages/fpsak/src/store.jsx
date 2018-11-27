import { routerMiddleware, connectRouter } from 'connected-react-router';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import * as reducers from './reducers';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : null;

const configureStore = (browserHistory) => {
  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(browserHistory),
    form: formReducer,
  });

  const middleware = [thunkMiddleware, routerMiddleware(browserHistory)];
  let enhancer;
  if (isDevelopment) {
    middleware.push(logger.createLogger());
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    /* eslint-enable */
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const initialState = {};

  return createStore(rootReducer, initialState, enhancer);
};

export default configureStore;
