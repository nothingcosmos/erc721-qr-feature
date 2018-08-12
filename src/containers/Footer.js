// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import type { GlobalStore } from '../stores';
import Component from '../components/Footer';

type Props = {
  store: GlobalStore,
};

type State = {
};
export default inject('store')(
  observer(
    class extends React.Component<Props, State> {
      componentDidMount() {
      }
      render() {
        return (
          <Component
            handleOpenPrivacy={() => this.props.store.router.openPrivacyPage()}
            handleOpenTerms={() => this.props.store.router.openTermsPage()}
          />
        )
      }
    }
  )
)
