// @flow
import * as React from 'react';

import { Card, CardText, CardBody, CardSubtitle, Button, Row } from 'reactstrap';

type Props = {
  client: string,
  uid: string,
  message: string,
  createdAt: string,
  isOwner: boolean,
  isClient: boolean,
  handleTransfer: () => void,
  handleDelete: () => void,
  handleLend: () => void,
  handleContract : () => void,
  handleUserDetail : () => void,
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
            <Button color="danger" outline className="ml-2" onClick={() => props.handleDelete()}>
              Reject
            </Button>
          </React.Fragment>
        )}
      </div>
      <div className="float-right">
        {props.isOwner && (
          <React.Fragment>
          <Button color="info" outline
            href="/"
            onClick={e => {
              e.preventDefault();
              props.handleUserDetail();
            }}
          >UserDetail
          </Button>
          <Button color="success" outline className="ml-2" onClick={() => props.handleContract()}>
            Contract
          </Button>
          </React.Fragment>
        )}
      </div>
      <div className="float-right mt-2">
        {props.isOwner && (
          <React.Fragment>
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
