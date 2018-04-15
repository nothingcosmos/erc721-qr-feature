// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/Snackbar';

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
      open={store.snackbar.open}
      message={store.snackbar.message}
      close={store.snackbar.close}
    />
  ))
);
