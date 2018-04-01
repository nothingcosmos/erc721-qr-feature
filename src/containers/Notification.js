// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/Notification';

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
      message={store.notification.message}
      timestamp={store.notification.timestamp}
    />
  ))
);
