// @flow
import {
  observable,
  action,
  computed,
  autorun,
  configure,
  runInAction,
} from 'mobx';

configure({ enforceActions: true });

export class RouterStore {
  @observable name = 'home';
  @observable tokenId = '';
  @observable account = '';
  @computed
  get currentUrl(): string {
    switch (this.name) {
      case 'home':
        return '/';
      case 'account':
        return `/account/${this.account}`;
      case 'token':
        return `/token/${this.tokenId}`;
      case 'register':
        return '/register';
      default:
        return '/404';
    }
  }
  @action.bound
  openHomePage() {
    this.name = 'home';
  }
  @action.bound
  openTokenPageById(tokenId: string) {
    this.name = 'token';
    this.tokenId = tokenId;
  }
  @action.bound
  openAccountPageById(account: string) {
    this.name = 'account';
    this.account = account;
  }
  @action.bound
  openRegisterPage() {
    this.name = 'register';
  }
}

export class GlobalStore {
  router = new RouterStore();
}

// Flow に return type を推論させると DRY でうれしいと思いきや，
// 「any に store が入っている型」に推論されてしまい，全くうれしくない
export type Store = {
  store: GlobalStore,
};

export default () => new GlobalStore();
