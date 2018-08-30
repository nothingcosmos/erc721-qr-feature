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

      handleSync() {
        this.props.store.syncAccountAddress();
      }

      textTo(accountAddress: string) {
        if (isNullOrUndefined(accountAddress) || !this.props.store.isAccountAvailable) {
          return `Please SignIn to ${this.props.store.deployedNetwork}.`;
        } else {
          const addr = accountAddress.substr(0, 6) + "..." + accountAddress.substr(-4, 4);
          return `${addr}`;
        }
      }

      componentDidMount() {
        this.props.authStore.fetchOAuthRedirect();
      }

      render() {
        return (
          <div className="d-flex flex-column">
            <div >
              {this.textTo(this.props.store.accountAddress)}
              <span className="ml-2">
              {!this.props.store.isAccountAvailable ?
                  <a style={{ cursor: 'pointer' }}
                    href="/"
                    onClick={e => {
                      e.preventDefault();
                      this.handleSync();
                    }}
                  > Sync
                  </a>:
                <a
                  style={{ cursor: 'pointer' }}
                  href="/items" onClick={e => {
                    e.preventDefault();
                    this.props.store.router.openItemsPageByAccountAddress();
                  }}>MyItems
                </a>
              }
              </span>
            </div>
            <div className="d-flex flex-row">
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
            <SignInModal
              modal={this.state.signInModal}
              toggle={this.toggleSignInModal}
              accountAddress={this.props.store.accountAddress}
              isMobile={this.props.authStore.isMobile()}
              handleSignIn={(email: string, password:string, create:boolean) => {
                this.props.authStore.signInEmailPassword(email, password, create);
                this.toggleSignInModal();
              }}
              handleOAuth={(provider: string) => {
                this.props.authStore.openOAuth(provider);
                this.toggleSignInModal();
              }}
              handleOpenPrivacy={ () => {
                this.props.store.router.openPrivacyPage();
                this.toggleSignInModal();
              }}
              handleOpenTerms={ () => {
                this.props.store.router.openTermsPage();
                this.toggleSignInModal();
              }}
            />
          </div >
        )
      }
    }
  )
)
