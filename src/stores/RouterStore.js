// @flow
import { observable, action, computed, autorun } from 'mobx';
import { GlobalStore } from '.';

export default class {
  @observable name = 'home'; //Homeで表示を切り替えている
  @observable tokenId = ''; //tokenIdの更新タイミングに注意、nameと同時に更新すると子の更新が遅れる。
  @observable account = '';

  constructor(globalStore: GlobalStore) {
    //observableの値更新のたびに呼ばれる
    autorun(() => {
      if (this.name === 'token') {
        this.setLoadingDetail(globalStore,true);
        globalStore.reloadTokenDetail(this.tokenId);
      }
      if (this.name === 'home') {
        globalStore.reloadHome();
      }
    });
  }

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
  setLoadingDetail(store:GlobalStore, isLoading:boolean) {
    store.isLoadingDetail = isLoading;
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
