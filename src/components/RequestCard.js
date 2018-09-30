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

  //escrow
  escrowAddress:string,

  //flag
  enableRental: boolean,
  enableCloudSign: boolean,
  enableEscrow: boolean,

  handleTransfer: () => void,
  handleDelete: () => void,
  handleLend: () => void,
  handleContract: () => void,
  handleUserDetail: () => void,
  handleCreateEscrow: () => void,
  handleApproveEscrow: () => void,
  handleTransferEscrowPayer: () => void,
  handleDepositEscrow: () => void,
};

export default (props: Props) => (
  <Card>
    <CardBody>
      <CardSubtitle>{props.client}</CardSubtitle>
      <CardText>{props.message}</CardText>
      <CardText>
        <small className="text-muted">{props.createdAt}</small>
        {props.escrowAddress != '' ? `EscrowAddress=${props.escrowAddress}`: ''}
      </CardText>
      {props.isOwner && (
        <div className="float-right mt-2">
          {props.enableCloudSign ?
            <Button color="success" outline className="ml-2" onClick={() => props.handleContract()}>
              Contract
            </Button>
            : <span />
          }
          {props.enableEscrow && props.escrowAddress == '' ?
            <Button color="success" outline className="ml-2" onClick={() => props.handleCreateEscrow()}>
              StartEscrow
            </Button>
            : <span />
          }
          {props.enableEscrow && props.escrowAddress != '' ?
            <Button color="warning" outline className="ml-2" onClick={() => props.handleApproveEscrow()}>
              ApproveEscrow
            </Button>
            : <span />
          }
          <Button color="info" outline className="ml-2" onClick={() => props.handleUserDetail()}>
            UserDetail
          </Button>
          {props.enableRental ?
            <Button color="info" outline className="ml-2" onClick={() => props.handleLend()}>
              TrialLend
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
      { props.isClient && (
        <div>
          <Button color="warning" outline className="ml-2" onClick={() => props.handleDepositEscrow()}>
            DepositEscrow
          </Button>
          <Button color="success" outline className="ml-2" onClick={() => props.handleTransferEscrowPayer()}>
          TransferEscrow
          </Button>
          </div>
        )}
    </CardBody>
  </Card>
);
