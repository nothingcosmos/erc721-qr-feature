// @flow
import * as React from 'react';
import { Row, Col, Form, Label, Input, FormGroup, CardImg, Button } from 'reactstrap';
import type {AuthUser} from '../stores';
function maybeNull(s: ?string) {
  return s || 'Not Available';
}

function isSignIn(user :?AuthUser) {
  return user != null;
}

type Props = {
  accountAddress:?string,
  authUser:?AuthUser,
};

type State = {
};

export default class extends React.Component<Props, State> {
  state = {
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
          <Label for="name">AccountAddress</Label>
          <Input type="text" id="name" disabled
            value={this.props.accountAddress}
          />
        </FormGroup>
      </Form>
        {((p) => {
          if (isSignIn(p.authUser)) {
            return (
              <div>
              <Form><FormGroup>
                  <Label for="uid">Uid</Label>
                  <Input type="text" id="uid" disabled
                    value={p.authUser.uid}
                  />
              </FormGroup></Form>
              <Form><FormGroup>
                  <Label for="provider">Provider</Label>
                  <Input type="text" id="provider" disabled
                    value={p.authUser.provider}
                  />
              </FormGroup></Form>
              <Form><FormGroup>
              <Label for="displayName">DisplayName</Label>
              <Input type="text" id="displayName" disabled
                value={p.authUser.displayName}
              />
              </FormGroup></Form>
              <Form><FormGroup>
              <Label for="email">Email</Label>
              <Input type="text" id="email" disabled
                value={p.authUser.email}
              />
              </FormGroup></Form>
              <CardImg
                top
                src={p.authUser.photoURL}
              />
              <Button color="danger" outline className="mt-2" onClick={() => this.props.handleSignOut()}>
                SignOut
              </Button>
              </div>
            );
          } else {
            return (<div><a>Please SignIn</a></div>)
          }
        })(this.props)}
    </Col>
    </Row>
    
  );
}
