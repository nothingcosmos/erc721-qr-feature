import * as React from 'react';

import { Card, CardText, CardBody, CardSubtitle, Button } from 'reactstrap';
import * as classnames from 'classnames';

type Props = {
  client: string,
  message: string,
  createdAt: string,
  isOwner: boolean,
  isClient: boolean,
  handleTransfer: () => void,
  handleDelete: () => void,
};

export default (props: Props) => (
  <Card>
    <CardBody>
      <CardSubtitle>{props.client}</CardSubtitle>
      <CardText>{props.message}</CardText>
      <CardText>
        <small className="text-muted">{props.createdAt}</small>
      </CardText>
      {props.isOwner && (
        <Button color="success" onClick={() => props.handleTransfer()}>
          Transfer
        </Button>
      )}
      {(props.isOwner || props.isClient) && (
        <Button
          color="danger"
          onClick={() => props.handleDelete()}
          className={classnames({ 'ml-2': props.isOwner })}
        >
          Delete
        </Button>
      )}
    </CardBody>
  </Card>
);
