// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/RegisterToken';

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
      onSubmit={(name: string, identity:string, description: string, image: File) =>
        store.registerToken(name, identity, description, image)
      }
    />
  ))
);
