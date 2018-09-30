// @flow
import * as React from 'react';

import { Card, CardText, CardBody, CardSubtitle, Button, Row, Col } from 'reactstrap';

type Props = {
  client: string,
  uid: string,
  message: string,
  createdAt: string,
  isOwner: boolean,
  isClient: boolean,

  enableRental: boolean,
  enableCloudSign: boolean,
  enableEscrow: boolean,

  handleTransfer: () => void,
  handleDelete: () => void,
  handleLend: () => void,
  handleContract: () => void,
  handleUserDetail: () => void,
  handleEscrow: () => void,
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
        <div className="float-right mt-2">
          {props.enableCloudSign ?
            <Button color="success" outline className="ml-2" onClick={() => props.handleContract()}>
              Contract
            </Button>
            : <span />
          }
          {props.enableEscrow ?
            <Button color="success" outline className="ml-2" onClick={() => props.handleEscrow()}>
              EscrowTransfer
            </Button>
            : <span />
          }
          <Button color="info" outline className="ml-2" onClick={() => props.handleUserDetail()}>
            UserDetail
          </Button>
          {props.enableRental ?
            <Button color="info" outline className="ml-2" onClick={() => props.handleLend()}>
              Trial Lend
            </Button>
            : <span />}
          <Button color="success" outline className="ml-2" onClick={() => props.handleTransfer()}>
            Transfer
            </Button>
          <Button color="danger" outline className="ml-2" onClick={() => props.handleDelete()}>
            Reject
            </Button>
        </div>
      )}
      {/* {props.isOwner && (
          <div className="float-right mt-2">
            
          </div>
        )} */}
      {/* props.isClient && (
          <Button color="warning" outline onClick={() => props.handleDelete()}>
            Cancel
          </Button>
        ) */}
    </CardBody>
  </Card>
);
