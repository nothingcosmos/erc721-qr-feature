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

//login用のmodalを用意してそっちに追い出すべき、アイコンで文字列を置き換え
const styles = {
  flex: {
    display: "flex",
  },
};

export default inject('store')(
  observer(({ store }: Store) => (
    <MuiThemeProvider>
      <React.Fragment>
        <Container>
          <div style={styles.flex}>
            <div>
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
            </div>
            <div><i className="fas fa-twitter-square" onClick={e => { e.preventDefault(); store.login("twitter"); }}></i></div>
            <div><i className="fas fa-github" onClick={e => { e.preventDefault(); store.login("github"); }}></i></div>
            <div><i className="fas fa-google" onClick={e => { e.preventDefault(); store.login("google"); }}></i></div>
          </div>
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
