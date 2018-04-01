// @flow
import * as React from 'react';
import { inject } from 'mobx-react';
import type { Store } from '../stores';
import Home from '../components/Home';
import TokenCard from '../components/TokenCard';

type Props = {
  store: Store,
};

export default inject(({ store }: Store) => ({}))(
  class extends React.Component<Props> {
    render = () => <Home />;
  }
);
