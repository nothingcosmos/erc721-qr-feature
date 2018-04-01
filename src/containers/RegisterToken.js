// @flow
import { inject } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/RegisterToken';

export default inject(({ store }: Store) => ({
  onSubmit: (name: string, description: string, image: File) => {
    store.registerToken(name, description, image);
  },
}))(Component);
