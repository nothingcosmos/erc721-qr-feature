// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Button } from 'reactstrap';
import type { Store, GlobalStore } from '../stores';
import {TokenDetail, Timer} from '../components/TokenDetail';
import RequestCard from '../components/RequestCard';
import RequestModal from '../components/RequestModal';
import TransferModal from '../components/TransferModal';
import RemoveCardModal from '../components/RemoveCardModal';
import ReturnLendOwnerModal from '../components/ReturnLendOwnerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {  observable } from "mobx"

type Props = {
  store: GlobalStore,
  routerStore:RouterStore,
};

type State = {
  requestModal: boolean,
  transferModal: boolean,
  lendModal:boolean,
  removeCardModal:boolean,
  returnLendOwnerModal:boolean,
};

export default inject('store', 'routerStore')(
  observer(
    class extends React.Component<Props, State> {
      state = {
        requestModal: false,
        transferModal: false,
        lendModal : false,
        removeCardModal: false,
        returnLendOwnerModal: false,
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
          transferModal:true,//共通利用している
        });
      };
      handleReturnLendOwner() {
        this.setState({
          returnLendOwnerModal:true,
        });
      }
      handleRemove = () => {
        this.setState({
          removeCardModal: true,
        });
      };
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
        return(
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
                <RequestCard
                  key={request.createdAt}
                  client={request.client}
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
                  handleLend={ () => {
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
                />
              ))}
            </Col>
          </Row>
          <RequestModal
            modal={this.state.requestModal}
            toggle={this.toggleRequestModal}
            onSubmit={message =>
              this.props.store.sendRequest(
                this.props.store.router.tokenId,
                message
              )
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
        </React.Fragment>
        )
      };
    }
  )
);
