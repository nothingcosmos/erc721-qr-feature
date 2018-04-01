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
import jsQR from 'jsqr';
import 'webrtc-adapter';

type Props = {
  modal: boolean,
  toggle: () => void,
};

type State = {
  result: string,
  cameras: any[],
};

export default class CameraModal extends React.Component<Props, State> {
  cameraStream: ?MediaStream;
  videoElement: ?HTMLVideoElement;
  state = {
    result: '',
    cameras: [],
  };
  async componentDidMount() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('Cannot use navigator.mediaDevices.enumerateDevices.');
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');
    if (videoInputs.length > 0) {
      this.startCamera(videoInputs[0].deviceId);
    }
    this.setState({
      cameras: videoInputs,
    });
  }
  componentWillUnmount() {
    this.stopCamera();
  }
  async startCamera(deviceId: string) {
    const constraints = {
      video: {
        deviceId,
      },
    };
    this.stopCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Cannot use navigator.mediaDevices.getUserMedia.');
    }
    this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (!this.videoElement) {
      throw new Error('video element is null.');
    }
    this.videoElement.srcObject = this.cameraStream;
    setTimeout(this.tick, 200);
  }
  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getVideoTracks().forEach(function(devise) {
        devise.stop();
      });
      this.cameraStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }
  tick = () => {
    if (this.videoElement && this.videoElement.srcObject) {
      if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d');
        if (
          !this.videoElement ||
          !this.videoElement.videoWidth ||
          !this.videoElement.videoHeight
        ) {
          throw new Error('videoWidth or videoHeight is null');
        }
        canvasElement.width = this.videoElement.videoWidth;
        canvasElement.height = this.videoElement.videoHeight;
        canvas.drawImage(
          this.videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          this.setState({
            result: code.data,
          });
        }
      }
      setTimeout(this.tick, 200);
    }
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
