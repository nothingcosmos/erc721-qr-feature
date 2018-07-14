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

type Props = {
  tokenId: string,
  name: string,
  owner: string,
  description: string,
  image: string,
  createdAt: string,
  isAccountAvailable: boolean,
  isOwner: boolean,
  handleSendRequest: () => any,
  handleTransfer: () => any,
  handleRemove: () => any,
};

export default (props: Props) => (
  <Card>
    <CardImg top src={props.image} />
    <CardBody>
      <CardTitle>{props.name}</CardTitle>
      <CardSubtitle>{props.owner}</CardSubtitle>
      <CardText>{props.description}</CardText>
      <CardText>
        <small className="text-muted">{props.createdAt}</small>
      </CardText>
      {props.isAccountAvailable && (
        <div className="d-flex justify-content-end">
          {props.isOwner ? (
            <React.Fragment>
            <Button
              color="success"
              outline
              onClick={() => props.handleTransfer()}
            >
              Transfer
            </Button>
            <Button color="danger" outline className="ml-2" onClick={() => props.handleRemove()}>
              Remove
            </Button>
          </React.Fragment>
          ) : (
            <Button
              color="primary"
              outline
              onClick={() => props.handleSendRequest()}
            >
              Send Request
            </Button>
          )}
        </div>
      )}
      <QRCode
        value={`token:${props.tokenId}`}
        style={{ width: '100%', height: '100%' }}
        className="mt-3 img-thumbnail"
      />
    </CardBody>
  </Card>
);
