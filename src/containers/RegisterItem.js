// @flow
import { inject } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/RegisterItem';

export default inject(({ store }: Store) => ({}))(Component);
