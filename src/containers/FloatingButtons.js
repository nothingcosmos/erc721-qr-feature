// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/FloatingButtons';

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
      isAccountAvailable={store.isAccountAvailable}
      moveToRegister={() => store.router.openRegisterPage()}
      moveToToken={tokenId => store.router.openTokenPageById(tokenId)}
      moveToAccount={account => store.router.openAccountPageById(account)}
      isAddress={address => store.isAddress(address)}
    />
  ))
);
