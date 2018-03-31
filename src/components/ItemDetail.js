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

type Props = {
  name: string,
  owner: string,
  description: string,
  image: string,
  createdAt: string,
  isOwner?: boolean,
  handleSendRequest: () => void,
  handleTransfer: () => void,
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
      {props.isOwner ? (
        <Button color="success" onClick={() => props.handleTransfer()}>
          Transfer
        </Button>
      ) : (
        <Button color="primary" onClick={() => props.handleSendRequest()}>
          Send Request
        </Button>
      )}
    </CardBody>
  </Card>
);
