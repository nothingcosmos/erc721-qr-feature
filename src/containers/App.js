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

import SignInModal from '../components/SignInModal';

import type { Store, AuthUser, GlobalStore } from '../stores';

//for react-fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined } from 'util';

library.add(fab, faSignInAlt);

const styles = {
  flex: {
    display: "flex",
  },
};

type Props = {
  store: GlobalStore,
};

type State = {
  signInModal: boolean,
};

export default inject('store')(
  observer(
    class extends React.Component<Props, State> {
      state = {
        signInModal: false,
      };
      toggleSignInModal = () => {
        this.setState({
          signInModal: !this.state.signInModal,
        });
      };
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
            <div><FontAwesomeIcon icon="sign-in-alt" className="ml-2"
              onClick={e => {
               e.preventDefault();
               this.toggleSignInModal();
              }} />
            </div>
            {((authUser:?AuthUser) => {
              if (isNullOrUndefined(authUser)) {
                return (
                  <div><a
                  style={{ cursor: 'pointer' }}
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    this.toggleSignInModal();
                  }}
                    >SignIn
                  </a></div>
                )
              } else {
                return (
                  <div>
                  <a
                  style={{ cursor: 'pointer' }}
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    this.props.store.router.openAccountPageById(authUser.uid);
                  }}
                    >{authUser.displayName}
                  </a>
                  </div>
                )
              }
            })(this.props.store.authUser)}
          </div>
          <Page />
          <hr />
          <Web3Status />
        </Container>
        <FloatingButtons />
        <Snackbar />
        <SignInModal
            modal={this.state.signInModal}
            toggle={this.toggleSignInModal}
            accountAddress={this.props.store.accountAddress}
            handleSignIn={(provider:string) => {
              this.props.store.signin(provider);
              this.setState({
                signInModal: false,
              });
            }}
          />
      </React.Fragment>
    </MuiThemeProvider>
      );//render
    }//class
  )//observer
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
