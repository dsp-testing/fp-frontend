import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { reducer as formReducer, reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import DecimalField from './DecimalField';

const MockForm = reduxForm({ form: 'mock' })(({ handleSubmit, children }) => <form onSubmit={handleSubmit}>{children}</form>);
const mountFieldInForm = (field, initialValues) => mount(
  <Provider store={createStore(combineReducers({ form: formReducer }))}>
    <IntlProvider locale="nb-NO" messages={{}}>
      <MockForm initialValues={initialValues}>
        {field}
      </MockForm>
    </IntlProvider>
  </Provider>,
);

describe('<DecimalField>', () => {
  it('skal legge til desimaler på onBlur hvis bruker kun skriver inn heltall', () => {
    const wrapper = mountFieldInForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={
          // @ts-ignore Fiks
          (value) => (Number.isNaN(value)
            ? value
            // @ts-ignore Fiks
            : parseFloat(value).toFixed(2))
        }
      />,
      { prosent: 10 },
    );
    expect(wrapper.find('input')).toHaveLength(1);
    wrapper.find('input').simulate('blur');
    wrapper.update();
    expect(wrapper.find('input').prop('value')).toEqual('10.00');
  });

  it('skal ikke legge til desimaler på onBlur hvis bruker skriver inn desimal', () => {
    const wrapper = mountFieldInForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={
          // @ts-ignore Fiks
          (value) => (Number.isNaN(value)
            ? value
            // @ts-ignore Fiks
            : parseFloat(value).toFixed(2))
        }
      />,
      { prosent: 10 },
    );
    expect(wrapper.find('input')).toHaveLength(1);
    wrapper.find('input').simulate('change', { target: { value: 10.32 } });
    wrapper.find('input').simulate('blur');
    wrapper.update();
    expect(wrapper.find('input').prop('value')).toEqual('10.32');
  });

  it('skal tilpasse tallet til 2 desimaler', () => {
    const wrapper = mountFieldInForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={
          // @ts-ignore Fiks
          (value) => (Number.isNaN(value)
            ? value
            // @ts-ignore Fiks
            : parseFloat(value).toFixed(2))
        }
      />,
      { prosent: 10 },
    );
    expect(wrapper.find('input')).toHaveLength(1);
    wrapper.find('input').simulate('change', { target: { value: 10.32284357893475 } });
    wrapper.find('input').simulate('blur');
    wrapper.update();
    expect(wrapper.find('input').prop('value')).toEqual('10.32');
  });
});
