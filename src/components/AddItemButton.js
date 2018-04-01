// @flow
import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconAddPhoto from 'material-ui/svg-icons/image/add-a-photo';

const styles = {
  floatingButton: {
    right: 20,
    bottom: 20,
    position: 'fixed',
  },
};

type Props = {
  handleRegister: () => void,
  handleCamera: () => void,
};

export default (props: Props) => (
  <div style={styles.floatingButton}>
    <FloatingActionButton
      onClick={() => props.handleCamera()}
      backgroundColor="#007bff"
    >
      <IconAddPhoto />
    </FloatingActionButton>
    <FloatingActionButton
      onClick={() => props.handleRegister()}
      backgroundColor="#007bff"
      className="ml-2"
    >
      <IconAdd />
    </FloatingActionButton>
  </div>
);
