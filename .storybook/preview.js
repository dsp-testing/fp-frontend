import React from 'react';
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';
import '@fpsak-frontend/assets/styles/global.less';

export const decorators = [(Story) => <div style={{ margin: '40px'}}><Story/></div>];
