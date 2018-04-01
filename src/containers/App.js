// @flow
import * as React from 'react';
import { inject } from 'mobx-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Container } from 'reactstrap';

import Home from './Home';
import TokenDetail from './TokenDetail';
import AccountDetail from './AccountDetail';
import RegisterToken from './RegisterToken';
import FloatingButtons from './FloatingButtons';

import type { Store, RouterStore } from '../stores';

const App = () => (
  <MuiThemeProvider>
    <React.Fragment>
      <Container>{renderPage}</Container>
      <FloatingButtons />
    </React.Fragment>
  </MuiThemeProvider>
);

export default inject(({ store }: Store) => ({
  routerStore: store.router,
}))(App);

function renderPage(routerStore: RouterStore) {
  switch (routerStore.name) {
    case 'home':
      return <Home />;
    case 'token':
      return <TokenDetail />;
    case 'account':
      return <AccountDetail />;
    case 'register':
      return <RegisterToken />;
    default:
      return null;
  }
}
