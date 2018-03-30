// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import App from './containers/App';
import createStores from './stores';
import 'bootstrap/dist/css/bootstrap.css';

const stores = createStores();

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.getElementById('react-root');
  if (elem) {
    ReactDOM.render(
      <Provider {...stores}>
        <App />
      </Provider>,
      elem
    );
  }
});
