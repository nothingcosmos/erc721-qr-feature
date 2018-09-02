// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { GlobalStore } from '../stores';
import Home from '../components/Home';
import TokenCard from '../components/TokenCard';

type Props = {
  store: GlobalStore,
};
type State = {
};
export default inject('store')(
  observer(
    class extends React.Component<Props, State> {
      componentDidMount() {
        this.props.store.reloadMyItems();
      }
      render() {
        return (
          <Home>
            {this.props.store.tokenCards.map(tokenCard => (
              <TokenCard
                key={tokenCard.tokenId}
                name={tokenCard.name}
                createdAt={tokenCard.createdAt}
                image={tokenCard.image}
                countRequest={tokenCard.countRequest}
                onClick={() => this.props.store.router.openTokenPageById(tokenCard.tokenId)}
              />
            ))}
          </Home>
        )
      }
    }
  )
)
