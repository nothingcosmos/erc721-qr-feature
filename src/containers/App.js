// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Container } from 'reactstrap';

import Home from './Home';
import TokenDetail from './TokenDetail';
import AccountDetail from './AccountDetail';
import RegisterToken from './RegisterToken';
import FloatingButtons from './FloatingButtons';
import Snackbar from './Snackbar';
import Web3Status from './Web3Status';

import type { Store } from '../stores';

export default inject('store')(
  observer(({ store }: Store) => (
    <MuiThemeProvider>
      <React.Fragment>
        <Container>
          <h1>
            <a
              style={{ cursor: 'pointer' }}
              href="/"
              onClick={e => {
                e.preventDefault();
                store.router.openHomePage();
              }}
            >
              ERC721 QR
            </a>
          </h1>
          <Page />
          <hr />
          <Web3Status />
        </Container>
        <FloatingButtons />
        <Snackbar />
      </React.Fragment>
    </MuiThemeProvider>
  ))
);

const Page = inject('store')(
  observer(({ store }: Store) => {
    switch (store.router.name) {
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
  })
);
