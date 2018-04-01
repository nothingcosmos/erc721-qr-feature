// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Home from '../components/Home';
import TokenCard from '../components/TokenCard';

export default inject('store')(
  observer(({ store }: Store) => (
    <Home>
      {store.tokenCards.map(tokenCard => (
        <TokenCard
          key={tokenCard.tokenId}
          name={tokenCard.name}
          createdAt={tokenCard.createdAt}
          image={tokenCard.image}
          onClick={() => store.router.openTokenPageById(tokenCard.tokenId)}
        />
      ))}
    </Home>
  ))
);
