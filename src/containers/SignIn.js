// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { GlobalStore } from '../stores';
import { isNullOrUndefined } from 'util';

import SignInModal from '../components/SignInModal';
import authStore from '../stores/authStore';
import type { AuthStore } from '../stores/authStore';

//for react-fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

library.add(fab, faSignInAlt);

type Props = {
  store: GlobalStore,
  authStore: AuthStore,
};
type State = {
  signInModal: boolean,
};

export default inject('store', 'authStore')(
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

      textTo(accountAddress: string) {
        if (isNullOrUndefined(accountAddress)) {
          return "Please signIn to MetaMask.";
        } else {
          const addr = accountAddress.substr(0, 6) + "..." + accountAddress.substr(-4,4);
          return `${addr}`;
        }
      }

      render() {
        return (
          <div className="d-flex flex-column">
            <div className="d-flex flex-row ml-4">
              <div><FontAwesomeIcon icon="sign-in-alt"
                onClick={e => {
                  e.preventDefault();
                  this.toggleSignInModal();
                }} />
              </div>
              <div className="ml-2">
                {isNullOrUndefined(this.props.authStore.authUser) ? (
                  <a
                    style={{ cursor: 'pointer' }}
                    href="/"
                    onClick={e => {
                      e.preventDefault();
                      this.toggleSignInModal();
                    }}
                  >SignIn
              </a>
                ) : (
                    <a
                      style={{ cursor: 'pointer' }}
                      href="/"
                      onClick={e => {
                        e.preventDefault();
                        this.props.store.router.openAccountPageById(this.props.authStore.authUser.uid);
                      }}
                    >{authStore.authUser.displayName}
                    </a>
                  )}
              </div>
            </div>            
            {<div className="ml-4">
              <dd className="text-truncate">
                {this.textTo(this.props.store.accountAddress)}
              </dd>
            </div>}
            <SignInModal
              modal={this.state.signInModal}
              toggle={this.toggleSignInModal}
              accountAddress={this.props.store.accountAddress}
              handleSignIn={(provider: string) => {
                this.props.authStore.signin(provider);
                this.setState({
                  signInModal: false,
                });
              }}
            />
          </div >
        )
      }
    }
  )
)
