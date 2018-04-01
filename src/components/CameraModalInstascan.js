// @flow
import React from 'react';
import {
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import * as Instascan from 'instascan';

type Props = {
  modal: boolean,
  toggle: () => void,
};

type State = {
  result: string,
  cameras: Instascan.Camera[],
};

export default class CameraModal extends React.Component<Props, State> {
  scanner: Instascan.Scanner;
  videoElement: ?HTMLVideoElement;
  state = {
    result: '',
    cameras: [],
  };
  componentDidMount() {
    const opt = {
      video: this.videoElement,
      scanPeriod: 5,
      mirror: false,
    };
    this.scanner = new Instascan.Scanner(opt);
    this.scanner.addListener('scan', function(result) {
      this.setState({
        result,
      });
    });
    Instascan.Camera.getCameras().then(cameras => {
      this.setState({
        cameras,
      });
      if (cameras.length > 0) {
        this.scanner.start(cameras[0]);
      } else {
        throw new Error('No cameras found.');
      }
    });
  }
  formatName(name: string) {
    return name || '(unknown)';
  }
  selectCamera = (cameraId: string) => {
    this.state.cameras.forEach(camera => {
      if (camera.id === cameraId) {
        this.scanner.start(camera);
      }
    });
  };
  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Modal title</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="cameraSelect">Cameras</Label>
            <Input
              type="select"
              id="cameraSelect"
              onChange={e => this.selectCamera(e.target.value)}
            >
              {this.state.cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  this.formatName(camera.name)
                </option>
              ))}
            </Input>
          </FormGroup>
          <video
            ref={e => {
              this.videoElement = e;
            }}
          />
          <p>{this.state.result}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
