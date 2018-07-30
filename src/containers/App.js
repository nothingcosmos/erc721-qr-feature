// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import {action, observable} from 'mobx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Container } from 'reactstrap';

import TokenDetail from './TokenDetail';
import AccountDetail from './AccountDetail';
import RegisterToken from './RegisterToken';
import FloatingButtons from './FloatingButtons';
import Snackbar from './Snackbar';
import Web3Status from './Web3Status';
import Home from './Home';
import SignIn from './SignIn';
import type { Store,  GlobalStore } from '../stores';

const styles = {
  flex: {
    display: "flex",
  },
};
type Props = {
  store: GlobalStore,
};

type State = {
};

export default inject('store')(
  observer(
    class extends React.Component<Props, State> {
    render = ()  => (
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
                  this.props.store.router.openHomePage();
                }}
              >
                ERC721 QR
              </a>          
            </h1>
            </div>
            <SignIn />
          </div>
          <Page />
          <hr />
          <Web3Status />
        </Container>
        <FloatingButtons />
        <Snackbar />
      </React.Fragment>
    </MuiThemeProvider>
      );//render
    }//class
  )//observer
);

//このPageオブジェクトに問題があるっぽい
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
