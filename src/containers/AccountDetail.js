// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store} from '../stores';
import authStore from '../stores/authStore';
import Component from '../components/AccountDetail';

export default inject('store', 'authStore')(
  observer(({store, authStore}) => ( //todo store, authStoreを型付したい
    <Component
        authUser={authStore.authUser}
        handleSignOut={ () => {
          authStore.signout();
          store.router.openHomePage();
        }}
    />
  ))
);