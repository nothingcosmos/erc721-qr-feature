// @flow
import * as React from 'react';
import {Button } from 'reactstrap';

const styles = {
  button: {
    padding: 0,
    verticalAlign: 'inherit',
  },
};

type Props = {
  handleOpenPrivacy: () => any,
  handleOpenTerms: () => any,
};

type State = {
};

export default class extends React.Component<Props, State> {
  state = {
  };
  render() {
    return (
      <React.Fragment>
        <Button
            color="link"
            onClick={this.props.handleOpenPrivacy}
            style={styles.button}
          >
            PrivacyPolicy
          </Button>
          <Button
            color="link"
            className="ml-2"
            onClick={this.props.handleOpenTerms}
            style={styles.button}
          >
            TermsOfService
          </Button>
      </React.Fragment>
    )
  }
}