// @flow
import { observable, action, computed, autorun } from 'mobx';
//import { GlobalStore } from '.';
import store from '.';

export class RouterStore {
  @observable name = 'home'; //Homeで表示を切り替えるために参照している
  @observable tokenId = ''; //parseUriの他に、クリック時にページ遷移でも変更する
  @observable account = '';

  //constructor(globalStore: GlobalStore) {
  constructor() {
    //observableの値更新のたびに呼ばれる
    //autorunは廃止、各containersのcomponentDidMountに移譲
    //autorun(()=> {});
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

export default new RouterStore();