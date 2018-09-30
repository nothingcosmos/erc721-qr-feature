// @flow
import * as React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

type Props = {
  modal: boolean,
  toggle: () => void,
  onSubmit: (lowerEth:number, afterDayes:number, message:string) => void,
  //
  tokenId:string,
  client:string,
};

type State = {
  lowerEth: number,
  afterDays : number,
  message: string,
};

export default class extends React.Component<Props, State> {
  state = {
    lowerEth: 0,
    afterDays: 7,
    message:"",
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.lowerEth, this.state.afterDays, this.state.message);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.modal}>
        <ModalHeader toggle={this.props.toggle}>Escrow Request</ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup>
              <Label for="client">AccountAddress</Label>
              <Input type="text" id="client" disabled
                value={this.props.client}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lower">Lower ETH(required)</Label>
              <Input
                type="text"
                id="lower"
                value={this.state.lowerEth}
                onChange={e => this.setState({ lowerEth: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="afterDayes">Deadline(days)(required)</Label>
              <Input
                type="text"
                id="afterDayes"
                value={this.state.afterDays}
                onChange={e => this.setState({ afterDays: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message (optional)</Label>
              <Input
                type="text"
                id="message"
                value={this.state.message}
                onChange={e => this.setState({ message: e.target.value })}
              />
            </FormGroup>
            <div className="float-right">
              <Button
                color="primary"
                outline
                onClick={e => this.handleSubmit(e)}
              >
                Submit
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}
