// @flow
import {
  observable,
  action,
  computed,
  autorun,
  configure,
  runInAction,
} from 'mobx';
import Ethereum from './ethereum';
import Firebase from './firebase';

configure({ enforceActions: true });

export class RouterStore {
  @observable name = 'home';
  @observable tokenId = '';
  @observable account = '';
  constructor(globalStore: GlobalStore) {
    autorun(() => {
      if (this.name === 'token') {
        globalStore.updateTokenDetail(this.tokenId);
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

export class NotificationStore {
  @observable timestamp = 0;
  @observable message = '';
  @action.bound
  send(message: string) {
    this.timestamp++;
    this.message = message;
  }
}

export class TokenDetailStore {
  @observable name = '';
  @observable description = '';
  @observable image = '';
  @observable owner = '';
  @observable createdAt = '';
}

export class GlobalStore {
  @observable router = new RouterStore(this);
  @observable notification = new NotificationStore();
  @observable tokenDetail = new TokenDetailStore();
  @observable account = '';
  ethereum = new Ethereum();
  firebase = new Firebase();
  @action.bound
  async registerToken(name: string, description: string, image: File) {
    // Web3からアドレスを取ってくる
    this.account = await this.ethereum.getAccount();
    // Firebaseに書き込む
    this.notification.send('メタデータを書き込んでいます');
    const tokenId = await this.firebase.registerToken(
      this.account,
      name,
      description
    );
    this.notification.send('画像をアップロードしています');
    await this.firebase.uploadImage(tokenId, image);
    // ブロックチェーンに書き込む
    this.notification.send('ブロックチェーンに書き込んでいます');
    await this.ethereum.mint(this.account, tokenId);
    this.notification.send('ブロックチェーンに書き込みました');
  }
  @action.bound
  async updateTokenDetail(tokenId: string) {
    const metadataPromise = this.firebase.fetchMetadata(tokenId);
    const ownerOfPromise = this.ethereum.ownerOf(tokenId);
    const accountPromise = this.ethereum.getAccount();
    const metadata = await metadataPromise;
    const ownerOf = await ownerOfPromise;
    const account = await accountPromise;
    runInAction(() => {
      this.tokenDetail.name = metadata.name;
      this.tokenDetail.description = metadata.description;
      this.tokenDetail.image = metadata.image;
      this.tokenDetail.createdAt = metadata.createdAt;
      this.tokenDetail.owner = ownerOf;
      this.account = account;
    });
  }

  isAddress = (hexString: string): boolean => {
    return this.ethereum.isAddress(hexString);
  };

  sendRequest(from: string, tokenId: string, message: string) {
    this.firebase.addRequest(from, tokenId, message);
  }

  transfer(from: string, to: string, tokenId: string) {
    this.ethereum.transfer(from, to, tokenId);
  }
}

// Flow に return type を推論させると DRY でうれしいと思いきや，
// 「any に store が入っている型」に推論されてしまい，全くうれしくない
export type Store = {
  store: GlobalStore,
};

export default () => new GlobalStore();
