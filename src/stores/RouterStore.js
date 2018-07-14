// @flow
import { observable, action, computed, autorun } from 'mobx';
import { GlobalStore } from '.';

export default class {
  @observable name = 'home';
  @observable tokenId = ''; //globalStateに1つだけ詰まっているため、他の方法に置き換えること
  @observable account = '';

  constructor(globalStore: GlobalStore) {
    autorun(() => {
      if (this.name === 'token') {
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
