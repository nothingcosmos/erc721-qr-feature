// @flow
import { inject } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/AddItemButton';

export default inject(({ store }: Store) => ({
  onClick: () => store.router.openRegisterPage(),
}))(Component);
