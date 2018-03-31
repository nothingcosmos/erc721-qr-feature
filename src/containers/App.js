// @flow
import * as React from 'react';
import { inject } from 'mobx-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Container } from 'reactstrap';

import Home from './Home';
import ItemDetail from './ItemDetail';
import UserDetail from './UserDetail';
import RegisterItem from './RegisterItem';
import AddItemButton from './AddItemButton';

import type { Store, RouterStore } from '../stores';

const App = () => (
  <MuiThemeProvider>
    <React.Fragment>
      <Container>{renderPage}</Container>
      <AddItemButton />
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
    case 'item':
      return <ItemDetail />;
    case 'user':
      return <UserDetail />;
    case 'register':
      return <RegisterItem />;
    default:
      return null;
  }
}
