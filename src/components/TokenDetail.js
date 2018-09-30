// @flow
import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  CardImg,
  CardLink,
} from 'reactstrap';
import * as QRCode from 'qrcode.react';
import {observable, action } from 'mobx';
import {  observer } from 'mobx-react';

type Props = {
  tokenId: string,
  name: string,
  owner: string,
  identity:string,
  description: string,
  image: string,
  createdAt: string,
  isAccountAvailable: boolean,
  isOwner: boolean,
  isLendOwner : boolean,

  enableRental : boolean,
  enableCloudSign : boolean,
  handleSendRequest: () => any,
  handleTransfer: () => any,
  handleRemove: () => any,
  handleLend: () => any,
  handleReturnLendOwner: () => any,
};

//observerつけても描画は変わらんなー
export class TokenDetail extends React.Component<Props, State> {
//export default ((props:Props) => (
  render = () => (
  <Card>
    <CardImg top src={this.props.image} />
    <CardBody>
      <CardTitle>{this.props.name}</CardTitle>
      <CardSubtitle>{this.props.owner}</CardSubtitle>
      <CardSubtitle>{this.props.identity}</CardSubtitle>
      <CardText>{this.props.description}</CardText>
      <CardText>
        <small className="text-muted">{this.props.createdAt}</small>
      </CardText>
      {this.props.isAccountAvailable && (
        <div className="d-flex justify-content-end">
          {this.props.isOwner ? (
            <React.Fragment>
            <Button
              color="success"
              outline
              onClick={() => this.props.handleTransfer()}
            >
              Transfer
            </Button>
            {this.props.enableRental ?
            <Button color="info" outline className="ml-2"
              onClick={() => this.props.handleLend()}
            >
              Lend
            </Button>
            : <div/>}
            <Button color="danger" outline className="ml-2"
              onClick={() => this.props.handleRemove()}>
              Remove
            </Button>
          </React.Fragment>
          ) : 
            this.props.isLendOwner ? (
              <Button
              color="primary"
              outline
              onClick={() => this.props.handleReturnLendOwner()}
            >
              Return LendOwner
            </Button>
            ) : (
            <Button
              color="primary"
              outline
              onClick={() => this.props.handleSendRequest()}
            >
              Send Request
            </Button>
          )}
        </div>
      )}
      <QRCode
        value={`token:${this.props.tokenId}`}
        style={{ width: '100%', height: '100%' }}
        className="mt-3 img-thumbnail"
      />
    </CardBody>
  </Card>
)
};
//);
