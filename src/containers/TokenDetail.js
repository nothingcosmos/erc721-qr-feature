// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Button } from 'reactstrap';
import type { Store, GlobalStore } from '../stores';
import type { RouterStore } from '../stores/RouterStore';
import type { AuthStore } from '../stores/authStore';
import { TokenDetail } from '../components/TokenDetail';
import RequestCard from '../components/RequestCard';
import RequestModal from '../components/RequestModal';
import TransferModal from '../components/TransferModal';
import RemoveCardModal from '../components/RemoveCardModal';
import ReturnLendOwnerModal from '../components/ReturnLendOwnerModal';
import UserDetailModal from '../components/UserDetailModal';
import ContractRequestModal from '../components/ContractRequestModal';
import LoadingSpinner from '../components/LoadingSpinner';

type Props = {
  store: GlobalStore,
  routerStore: RouterStore,
  authStore: AuthStore,
};

type State = {
  requestModal: boolean,
  transferModal: boolean,
  lendModal: boolean,
  removeCardModal: boolean,
  returnLendOwnerModal: boolean,
  userDetailModal: boolean,
  contractRequestModal : boolean,
};

//todo modalの制御が肥大化してるのでなんとかしたい
export default inject('store', 'routerStore', 'authStore')(
  observer(
    class extends React.Component<Props, State> {
      state = {
        requestModal: false,
        transferModal: false,
        lendModal: false,
        removeCardModal: false,
        returnLendOwnerModal: false,
        userDetailModal: false,
        contractRequestModal: false,
      };
      handleSendRequest = () => {
        this.setState({
          requestModal: true,
        });
      };
      toggleRequestModal = () => {
        this.setState({
          requestModal: !this.state.requestModal,
        });
      };
      handleTransfer = () => {
        this.setState({
          transferModal: true,
        });
      };
      handleLend = () => {
        this.setState({
          lendModal: true,
          transferModal: true,//共通利用している
        });
      };
      handleReturnLendOwner = () => {
        this.setState({
          returnLendOwnerModal: true,
        });
      }
      handleRemove = () => {
        this.setState({
          removeCardModal: true,
        });
      };
      handleUserDetail = () => {
        this.setState({
          userDetailModal: true,
        });
      }
      handleContractRequest = () => {
        this.setState({
          contractRequestModal:true,
        });
      }

      toggleTransferModal = () => {
        this.setState({
          transferModal: !this.state.transferModal,
          lendModal: !this.state.lendModal,
        });
      };
      toggleRemoveCardModal = () => {
        this.setState({
          removeCardModal: !this.state.removeCardModal,
        });
      };
      toggleReturnLendOwnerModal = () => {
        this.setState({
          returnLendOwnerModal: !this.state.returnLendOwnerModal,
        });
      };
      toggleUserDetailModal = () => {
        this.setState({
          userDetailModal : !this.state.userDetailModal,
        });
      }
      toggleContractRequestModal = () => {
        this.setState({
          contractRequestModal : !this.state.contractRequestModal,
        });
      }

      componentDidMount() {
        this.props.store.reloadTokenDetail(this.props.routerStore.tokenId);
      }

      //ここの書き方がrender = () => { //だとcontainersの更新が伝搬してrender対象とされなかった。
      render() {
        if (this.props.store.isLoadingDetail) {
          return (
            <React.Fragment>
              <LoadingSpinner />
            </React.Fragment>
          );
        }
        //trace(true);//mobx
        return (
          <React.Fragment>
            <Row>
              <Col
                lg={{ size: 6, offset: 3 }}
                md={{ size: 8, offset: 2 }}
                sm={{ size: 10, offset: 1 }}
              >
                <div className="pb-3">
                  <TokenDetail
                    tokenId={this.props.store.router.tokenId}
                    name={this.props.store.tokenDetail.name}
                    owner={this.props.store.tokenDetail.owner}
                    identity={this.props.store.tokenDetail.identity}
                    description={this.props.store.tokenDetail.description}
                    image={this.props.store.tokenDetail.image}
                    createdAt={this.props.store.tokenDetail.createdAt}
                    isOwner={
                      this.props.store.isAccountAvailable &&
                      this.props.store.accountAddress ===
                      this.props.store.tokenDetail.owner
                    }
                    isLendOwner={this.props.store.tokenDetail.isLent &&
                      this.props.store.accountAddress ===
                      this.props.store.tokenDetail.lendOwner
                    }
                    isAccountAvailable={this.props.store.isAccountAvailable}
                    handleSendRequest={() => this.handleSendRequest()}
                    handleTransfer={() => this.handleTransfer()}
                    handleRemove={() => this.handleRemove()}
                    handleLend={() => this.handleLend()}
                    handleReturnLendOwner={() => this.handleReturnLendOwner()}
                  />
                </div>
                {this.props.store.tokenDetail.requests && <h2>Requests</h2>}
                {this.props.store.tokenDetail.requests.map(request => (
                  <React.Fragment>
                  <RequestCard
                    key={request.createdAt}
                    client={request.client}
                    uid={request.uid}
                    message={request.message}
                    createdAt={request.createdAt}
                    isOwner={
                      this.props.store.accountAddress ===
                      this.props.store.tokenDetail.owner
                    }
                    isClient={request.client === this.props.store.accountAddress}
                    handleTransfer={() => {
                      this.props.store.transfer(
                        this.props.store.accountAddress,
                        request.client,
                        this.props.store.router.tokenId
                      );
                    }}
                    handleLend={() => {
                      //throw new Error("Not implemented yet.")
                      this.props.store.lend(
                        this.props.store.accountAddress,
                        request.client,
                        this.props.store.router.tokenId,
                        30 //初期値
                      );
                    }}
                    handleDelete={() => {
                      // throw new Error('Not implemented yet');
                      this.props.store.deleteRequest(
                        this.props.store.router.tokenId,
                        request.requestId
                      );
                    }}
                    handleUserDetail={() => {
                      this.props.authStore.fetchViewUser(request.uid);
                      this.handleUserDetail();
                    }}
                    handleContract={() => {
                      this.handleContractRequest();
                    }}
                  />
                  <ContractRequestModal
              modal={this.state.contractRequestModal}
              toggle={this.toggleContractRequestModal}
              onSubmit={(accessToken:string, message:string)=> {
                this.props.store.sendSignDocument(
                  accessToken,
                  request.tokenId,
                  request.requestId,                      
                  request.uid,
                  message
              );
              }}
            />
            </React.Fragment>
                ))}
              </Col>
            </Row>
            <RequestModal
              modal={this.state.requestModal}
              toggle={this.toggleRequestModal}
              onSubmit={message => {
                this.props.store.sendRequest(
                  this.props.store.router.tokenId,
                  message
                );
                //detailをreloadすべきか
              }
              }
            />
            <TransferModal
              modal={this.state.transferModal}
              toggle={this.toggleTransferModal}
              from={this.props.store.accountAddress}
              tokenId={this.props.store.router.tokenId}
              onSubmit={to =>
                this.props.store.transfer(
                  this.props.store.accountAddress,
                  to,
                  this.props.store.router.tokenId
                )
              }
              onSubmitLend={(to, afterDays) =>
                this.props.store.lend(
                  this.props.store.accountAddress,
                  to,
                  this.props.store.router.tokenId,
                  afterDays
                )
              }
              isAddress={this.props.store.isAddress}
              modeTransfer={!this.state.lendModal}
            />
            <RemoveCardModal
              modal={this.state.removeCardModal}
              toggle={this.toggleRemoveCardModal}
              from={this.props.store.accountAddress}
              tokenId={this.props.store.router.tokenId}
              onSubmit={id => {
                this.props.store.removeToken(
                  this.props.store.accountAddress,
                  id
                );
              }}
            />
            <ReturnLendOwnerModal
              modal={this.state.returnLendOwnerModal}
              toggle={this.toggleReturnLendOwnerModal}
              from={this.props.store.tokenDetail.owner}
              tokenId={this.props.store.router.tokenId}
              lendOwner={this.props.store.tokenDetail.lendOwner}
              deadline={this.props.store.tokenDetail.deadline}
              onSubmit={id => {
                this.props.store.returnLendOwner(
                  this.props.store.accountAddress,
                  id
                );
              }}
            />
            <UserDetailModal
              modal={this.state.userDetailModal}
              toggle={this.toggleUserDetailModal}
              viewUser={this.props.authStore.viewUser}
            />
          </React.Fragment>
        )
      };
    }
  )
);
