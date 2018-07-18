// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/AccountDetail';

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
        accountAddress={store.accountAddress}
        authUser={store.authUser}
    />
  ))
);