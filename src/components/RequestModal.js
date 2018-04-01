// @flow
import React from 'react';
import {
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
} from 'reactstrap';

type Props = {
  modal: boolean,
  toggle: () => void,
};

type State = {
  result: string,
  cameras: any[],
};

export default class CameraModal extends React.Component<Props, State> {
  
  state = {
    result: '',
    cameras: [],
  };
  
  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalBody>
          <FormGroup>
            <Label for="cameraSelect">Camera</Label>
            <Input
              type="select"
              id="cameraSelect"
              onChange={e => this.startCamera(e.target.value)}
            >
              {this.state.cameras.map(camera => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || '(Unknown)'}
                </option>
              ))}
            </Input>
          </FormGroup>
          <video
            width="100%"
            autoPlay
            playsInline
            ref={e => {
              this.videoElement = e;
            }}
            className="border rounded"
          />
          <p>{this.state.result}</p>
          <div class="float-right">
            <Button onClick={this.props.toggle} outline color="secondary">
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
