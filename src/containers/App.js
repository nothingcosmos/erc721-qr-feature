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
import MyItems from './MyItems';
import SignIn from './SignIn';
import Footer from './Footer';
import Privacy from '../components/Privacy';
import Terms from '../components/Terms';
import type { Store,  GlobalStore } from '../stores';

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
            <div>
            <h1>
              <a
                style={{ cursor: 'pointer', width:'50px' }}
                href="/"
                onClick={e => {
                  e.preventDefault();
                  this.props.store.router.openHomePage();
                }}
              >
                {this.props.store.serviceName}
              </a>
            </h1>
            </div>
            <SignIn />
          <hr />
          <Page />
          <hr />
          <Web3Status />
          <hr />
          <Footer />
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
      case 'items':
        return <MyItems />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      default:
        return null;
    }
  })
);
