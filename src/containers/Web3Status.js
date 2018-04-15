// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { Store } from '../stores';
import Component from '../components/Web3Status';

// type Props = {
//   isConnected: boolean,
//   network: string,
//   account: string,
//   contractAddress: string,
//   refreshNetworkName: () => void,
//   refreshAccountAddress: () => void,
//   openContractAddressDialog: () => void,
// };

export default inject('store')(
  observer(({ store }: Store) => (
    <Component
      isConnected={store.isWeb3Connected}
      networkName={store.networkName}
      accountAddress={store.accountAddress}
      contractAddress={store.contractAddress}
      refreshNetworkName={() => store.syncNetworkName()}
      refreshAccountAddress={() => store.syncAccountAddress()}
      updateContractAddress={address => store.setContractAddress(address)}
      isAddress={address => store.isAddress(address)}
    />
  ))
);
