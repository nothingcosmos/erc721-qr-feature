// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Store } from '../stores';
import Home from '../components/Home';
import TokenCard from '../components/TokenCard';

export default inject('store')(
  observer(
    class extends React.Component<Props, State> {
      componentDidMount() {
        this.props.store.reloadHome();
      }

      render = () => {
        const {isLoadingCards, tokenCards} = this.props.store;
        if (isLoadingCards) {
          return (<LoadingSpinner />);
        }
        return (
        <Home>
          {tokenCards.map(tokenCard => (
            <TokenCard
              key={tokenCard.tokenId}
              name={tokenCard.name}
              createdAt={tokenCard.createdAt}
              image={tokenCard.image}
              onClick={() => this.props.store.router.openTokenPageById(tokenCard.tokenId)}
            />
          ))}
        </Home>
        );
      }
    }
  )
);
