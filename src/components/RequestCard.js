// @flow
import * as React from 'react';

import { Card, CardText, CardBody, CardSubtitle, Button } from 'reactstrap';

type Props = {
  client: string,
  message: string,
  createdAt: string,
  isOwner: boolean,
  isClient: boolean,
  handleTransfer: () => void,
  handleDelete: () => void,
  handleLend: () => void,
};

export default (props: Props) => (
  <Card>
    <CardBody>
      <CardSubtitle>{props.client}</CardSubtitle>
      <CardText>{props.message}</CardText>
      <CardText>
        <small className="text-muted">{props.createdAt}</small>
      </CardText>
      <div className="float-right">
        {props.isOwner && (
          <React.Fragment>
            <Button color="danger" outline onClick={() => props.handleDelete()}>
              Reject
            </Button>
            <Button color="info" outline className="ml-2" onClick={() => props.handleLend()}>
              Trial Lend
            </Button>
            <Button
              color="success"
              outline
              onClick={() => props.handleTransfer()}
              className="ml-2"
            >
              Accept
            </Button>
          </React.Fragment>
        )}
        {/* props.isClient && (
          <Button color="warning" outline onClick={() => props.handleDelete()}>
            Cancel
          </Button>
        ) */}
      </div>
    </CardBody>
  </Card>
);
