// @flow
import { inject } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/FloatingButtons';

export default inject(({ store }: Store) => ({
  moveToRegister: () => store.router.openRegisterPage(),
  moveToToken: tokenId => store.router.openTokenPageById(tokenId),
  moveToAccount: account => store.router.openAccountPageById(account),
}))(Component);
