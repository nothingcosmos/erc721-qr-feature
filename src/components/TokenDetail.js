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
  handleSendRequest: () => any,
  handleTransfer: () => any,
  handleRemove: () => any,
};

//observerつけても描画は変わらんなー
export class TokenDetail extends React.Component<Props, State> {
  // @observable secondsPassed = 0
  // componentWillMount() {
  //   setInterval(() => {
  //      this.update();
  //      //old これはinvaliant failed
  //      //this.setState(()=> {})
  //   }, 1000)
  // }
  // @action
  // update() {
  //   this.secondsPassed++;
  // }

//export default ((props:Props) => (
  render = () => (
  <Card>
    <CardImg top src={this.props.image} />
    <CardBody>
      <CardTitle>{this.props.name}</CardTitle>
      <CardSubtitle>{this.props.owner}</CardSubtitle>
      <CardText>{this.props.identity}</CardText>
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
            <Button color="danger" outline className="ml-2" onClick={() => this.props.handleRemove()}>
              Remove
            </Button>
          </React.Fragment>
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

//描画の確認用クラス　これは動作する
@observer export class Timer extends React.Component {
  @observable secondsPassed = 0
  componentWillMount() {
    setInterval(() => {
       this.update();
       //old これはinvaliant failed
       //this.setState(()=> {})
    }, 1000)
  }
  @action
  update() {
    this.secondsPassed++;
  }

  render() {
      return (<span>waiting { this.secondsPassed } seconds.</span> )
  }
}