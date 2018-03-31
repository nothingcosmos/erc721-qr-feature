// @flow
import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconAdd from 'material-ui/svg-icons/content/add';

const styles = {
  floatingButton: {
    right: 20,
    bottom: 20,
    position: 'fixed',
  },
};

type Props = {
  onClick: () => void,
};

export default (props: Props) => (
  <FloatingActionButton
    onClick={props.onClick}
    style={styles.floatingButton}
    backgroundColor="#007bff"
  >
    <IconAdd />
  </FloatingActionButton>
);
