// @flow
import * as React from 'react';
import { Row, Col, Form, Label, Input, FormGroup, Button } from 'reactstrap';
import {AuthUser} from '../stores/index';
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
      <dl>
        <dt>accountAddress</dt>
        <dd className="text-truncate">
          {maybeNull(this.props.accountAddress)}
        </dd>
        {((p) => {
          if (isSignIn(p.authUser)) {
            return (
              <div>
              <dt>Provider</dt>
              <dd className="text-truncate">
              {p.authUser.provider}
              </dd>
              <dt>Name</dt>
              <dd className="text-truncate">
              {p.authUser.displayName}
              </dd>
              </div>
            );
          } else {
            return (<div><span>Please SignIn</span></div>)
          }
        })(this.props)}
      </dl>
    </Row>
  );
}
