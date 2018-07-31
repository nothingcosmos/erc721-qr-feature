// @flow
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
//import DevTools from 'mobx-react-devtools'
import { Provider } from 'mobx-react';
// https://github.com/flatiron/director/issues/332
// https://github.com/flatiron/director/issues/349
import { Router } from 'director/build/director';

import 'bootstrap/dist/css/bootstrap.css';

import App from './containers/App';
import store from './stores';
import authStore from './stores/authStore';
import routerStore from './stores/RouterStore';

const stores = {
  store,
  authStore,
  routerStore,
};

// ここで定義したopenXXXが呼び出されるのはブラウザで開いた直後だけで，
// openXXXでcurrentUrlを変更したときに起こるpushStateの後にはopenXXXは呼び出されない
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
  // setRouteしないとRouterが発火しないという意味？
  if (window.location.pathname !== path)
    window.history.pushState(null, null, path);
});

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.getElementById('react-root');
  if (elem) {
    ReactDOM.render(
      <Provider {...stores}>
        <StrictMode>
          <App />
        </StrictMode>
      </Provider>,
      elem
    );
  }
});
