// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { Provider } from 'mobx-react';
import { Router } from 'director';

import App from './containers/App';
import createStore from './stores';
import 'bootstrap/dist/css/bootstrap.css';

const store = createStore();

new Router({
  '/': () => store.router.openHomePage(),
  '/token/:tokenId': tokenId => store.router.openTokenPageById(tokenId),
  '/user/:userId': account => store.router.openAccountPageById(account),
  '/register': () => store.router.openRegisterPage(),
})
  .configure({
    html5history: true,
  })
  .init();

autorun(() => {
  const path = store.router.currentUrl;
  // setRouteでもいいのかも？
  // https://github.com/flatiron/director#setrouteroute
  if (window.location.pathname !== path)
    window.history.pushState(null, null, path);
});

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.getElementById('react-root');
  if (elem) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      elem
    );
  }
});
