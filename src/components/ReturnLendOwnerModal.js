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
  from: string,
  tokenId: string,
  lendOwner : string,
  deadline : string,
  onSubmit: (tokenId: string) => void | Promise<void>,
};

type State = {

};

export default class extends React.Component<Props, State> {
  state = {
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.props.tokenId);
    this.props.toggle();
  };

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.modal}>
          <ModalHeader toggle={this.props.toggle}>Return LendOwer</ModalHeader>
          <ModalBody>
            <Form>
            <FormGroup>
                <Label for="tokenId">Token ID</Label>
                <Input
                  type="text"
                  id="tokenId"
                  disabled
                  value={this.props.tokenId}
                />
              </FormGroup>
              <FormGroup>
                <Label for="from">From</Label>
                <Input type="text" id="from" disabled value={this.props.from} />
              </FormGroup>
              <FormGroup>
                <Label for="lendOwner">LendOwner</Label>
                <Input type="text" id="lendOwner" disabled value={this.props.lendOwner} />
              </FormGroup>
              <FormGroup>
                <Label for="deadline">Deadline</Label>
                <Input type="text" id="deadline" disabled value={this.props.deadline} />
              </FormGroup>
              
              <div className="float-right">
                <Button
                  color="danger"
                  outline
                  onClick={e => this.handleSubmit(e)}
                >
                  ReturnLendOwner
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
