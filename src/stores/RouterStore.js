// @flow
import { observable, action, computed, autorun } from 'mobx';
//import { GlobalStore } from '.';
import store from '.';

export class RouterStore {
  apiEndpoint : string = "https://erc721-qr-feature.firebaseapp";
  hostingEndpoint : string = "https://erc721-qr-feature.firebaseapp.com";

  @observable name = 'home'; //Homeで表示を切り替えるために参照している
  @observable tokenId = ''; //parseUriの他に、クリック時にページ遷移でも変更する
  @observable account = ''; //uid

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
      case 'items':
        return `/items`;
      case 'privacy':
        return '/privacy';
      case 'terms':
        return '/terms';
      default:
        return '/404';
    }
  }

  getTokenLink(tokenId:string) : string {
    return this.hostingEndpoint + `/token/${tokenId}`;
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
  openItemsPageByAccountAddress() {
    this.name = 'items';
  }

  @action.bound
  openRegisterPage() {
    this.name = 'register';
  }

  @action.bound
  openPrivacyPage() {
    this.name = 'privacy';
  }
  
  @action.bound
  openTermsPage() {
    this.name = 'terms';
  }
}

export default new RouterStore();