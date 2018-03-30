// @flow
import * as React from 'react';
import { Row, Col, Form, Label, Input, FormGroup, Button } from 'reactstrap';

type Props = {
  onSubmit: (name: string, description: string, image: File) => void,
};

type State = {
  name: string,
  description: string,
  image: ?File,
};

export default class extends React.Component<Props, State> {
  state = {
    name: '',
    description: '',
    image: null,
  };
  imageInput: ?HTMLInputElement;
  handleClick = () => {
    if (!this.state.image) {
      return;
    }
    this.props.onSubmit(
      this.state.name,
      this.state.description,
      this.state.image
    );
  };
  validateForm = () => {
    return this.state.name && this.state.image;
  };
  render = () => (
    <Row>
      <Col
        lg={{ size: 6, offset: 3 }}
        md={{ size: 8, offset: 2 }}
        sm={{ size: 10, offset: 1 }}
      >
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="image">Image</Label>
            <Input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              onChange={e => this.setState({ image: e.target.files[0] })}
            />
          </FormGroup>
          <Button
            color="primary"
            onClick={this.handleClick}
            disabled={!this.validateForm()}
          >
            Register
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
