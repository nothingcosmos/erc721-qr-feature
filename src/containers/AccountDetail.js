// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store} from '../stores';
import authStore from '../stores/authStore';
import Component from '../components/AccountDetail';

export default inject('store', 'authStore')(
  observer(({store, authStore}) => (
    <Component
        accountAddress={store.accountAddress}
        authUser={authStore.authUser}
    />
  ))
);