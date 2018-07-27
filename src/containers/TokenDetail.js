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
import {  observable } from "mobx"

type Props = {
  store: GlobalStore,
  routerStore:RouterStore,
};

type State = {
  requestModal: boolean,
  transferModal: boolean,
  removeCardModal:boolean,
};

export default inject('store', 'routerStore')(
  observer(
    class extends React.Component<Props, State> {
      state = {
        requestModal: false,
        transferModal: false,
        removeCardModal: false,
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
      handleRemove = () => {
        this.setState({
          removeCardModal: true,
        });
      };
      toggleTransferModal = () => {
        this.setState({
          transferModal: !this.state.transferModal,
        });
      };
      toggleRemoveCardModal = () => {
        this.setState({
          removeCardModal: !this.state.removeCardModal,
        });
      };
      refresh = () => {
        this.setState({
          transferModal:false,
          removeCardModal:false,
          transferModal:false,
        });
      };

      componentDidMount() {
        this.props.store.reloadTokenDetail(this.props.routerStore.tokenId);
      }

      render() {
        //console.info("callee render");
        //console.info(this.props.store.tokenDetail.image);
        //flag制御でもだめっぽい, containersのレイヤで更新が伝搬しない

        //苦肉の策で手動refreshしかない
        if (this.props.store.isLoadingDetail) {
          return (
            <React.Fragment>
            <div>
              <Button color="success" outline
                onClick={() => this.refresh()}>Refresh
              </Button>
            </div>
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
                  isAccountAvailable={this.props.store.isAccountAvailable}
                  handleSendRequest={() => this.handleSendRequest()}
                  handleTransfer={() => this.handleTransfer()}
                  handleRemove={() => this.handleRemove()}
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
                  handleDelete={() => {
                    throw new Error('Not implemented yet');
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
            isAddress={this.props.store.isAddress}
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
        </React.Fragment>
        )
      };
    }
  )
);
