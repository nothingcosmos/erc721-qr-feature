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
  @observable itemId = '';
  @observable userId = '';
  @computed
  get currentUrl(): string {
    switch (this.name) {
      case 'home':
        return '/';
      case 'user':
        return `/user/${this.userId}`;
      case 'item':
        return `/item/${this.itemId}`;
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
  openItemPageById(itemId: string) {
    this.name = 'item';
    this.itemId = itemId;
  }
  @action.bound
  openUserPageById(userId: string) {
    this.name = 'user';
    this.userId = userId;
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
