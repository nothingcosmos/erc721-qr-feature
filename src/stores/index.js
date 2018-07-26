// @flow
import { observable, computed, configure, runInAction, action } from 'mobx';
import RouterStore from './RouterStore';
import SnackbarStore from './SnackbarStore';
import Ethereum from './ethereum';
import FirebaseAgent from './firebase';
import { isNullOrUndefined } from 'util';
import ContractAddress from '../contracts/address.json';

configure({ enforceActions: 'strict' });

type RequestItem = {
  client: string,
  tokenId: string,
  message: string,
  createdAt: string,
};

//metadata standard formatと連動
export class TokenDetailStore {
  @observable name = '';
  @observable identity = '';
  @observable description = '';
  @observable image = '';
  @observable owner = '';
  @observable ownerUid = '';//未実装 functionsの認証と連携させたい
  @observable createdAt = '';
  @observable requests: RequestItem[] = [];
  @observable tags: string[] = [];
  //@observable etherscanUrl = ''; //create txとtransferのtxは別ものか。。
}

export type TokenItem = {
  tokenId: string,
  name: string,
  image: string,
  createdAt: string,
};

export class GlobalStore {
  @observable router = new RouterStore(this);
  @observable snackbar = SnackbarStore;

  ethereum: Ethereum;
  @observable isWeb3Connected: boolean = false;
  @observable accountAddress: ?string = null;
  @observable networkName: ?string = null;
  @observable contractAddress: ?string = null;
  @observable tokenCards: TokenItem[] = [];
  @observable tokenDetail: TokenDetailStore = new TokenDetailStore(); //ここの更新が問題 伝搬しない？
  @observable isLoadingDetail: boolean = false;

  firebase = FirebaseAgent;

  constructor(contractAddress: string) {
    //console.info("contractAddress="+contractAddress);
    this.ethereum = new Ethereum(contractAddress);
    runInAction(() => {
      this.contractAddress = contractAddress;
      this.isWeb3Connected = !!window.web3;
    });
    this.syncAccountAddress();
    this.syncNetworkName();
  }

  setContractAddress(address: string) {
    runInAction(() => {
      this.contractAddress = address;
    });
    this.ethereum.setContractAddress(address);
  }  

  async syncAccountAddress() {
    const account = await this.ethereum.getAccount();
    runInAction(() => {
      this.accountAddress = account;
    });
  }

  async syncNetworkName() {
    const networkName = await this.ethereum.getNetwork();
    runInAction(() => {
      this.networkName = networkName;
    });
  }

  async registerToken(name: string, identity:string, description: string, image: File) {
    try {
      // Firebaseに書き込む
      this.snackbar.send('メタデータを書き込んでいます');
      if (!this.accountAddress) {
        throw new Error('Cannot get account');
      }
    
      const tokenId = await this.firebase.registerToken(
        this.accountAddress,
        name,
        description,
        identity
      );
      this.snackbar.send('画像をアップロードしています');
      await this.firebase.uploadImage(tokenId, image);
      // トランザクションを送信する
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しています`
      );
      if (!this.accountAddress) {
        throw new Error('Cannot get account');
      }

      const image_info = await this.firebase.fetchImageUrl(tokenId);
      const metadata = this.ethereum.createMetadata(tokenId, name, identity, description, image_info.image);
      await this.ethereum.mintWithMetadata(this.accountAddress, tokenId, metadata);
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しました`
      );
    } catch(err) {
      this.snackbar.send(`Errorが発生し、登録に失敗しました。detail=${err}`);
    };
    this.router.openHomePage();
  }

  async transfer(from: string, to: string, tokenId: string) {
    this.snackbar.send(
      `${this.networkName || '(null)'} にトランザクションを送信しています`
    );
    await this.ethereum.transfer(from, to, tokenId);
    this.snackbar.send(
      `${this.networkName || '(null)'} にトランザクションを送信しました`
    );
  }

  async removeToken(ownerAddress:string, tokenId:string) {
    try {
      await this.firebase.removeToken(ownerAddress, tokenId);
      this.router.openHomePage();
    } catch(err) {
      this.snackbar.send(
        `${tokenId}の削除に失敗しました。detail=${err || '(null)'}`
      );
    }
  }

  getEtherscanAddressUrl(accountAddress:string) : string {
    return `https://${this.networkName}.etherscan.io/address/${accountAddress}`;
  }

  getEtherscanTxUrl(txhash:string) : string {
    return `https://${this.networkName}.etherscan.io/tx/${txhash}`;
  }

  //URLをparseして開く際に呼ばれる,他にdetailをクリックした際にも呼ばれる。 
  @action
  async reloadTokenDetail(tokenId: string) {
    //console.info("callee reloadToken");
    try {
      if (isNullOrUndefined(tokenId)) {
        throw new Error('Invalid tokenId');
      }
      const metadataPromise = this.firebase.fetchToken(tokenId);
      const ownerOfPromise = this.ethereum.ownerOf(tokenId);
      const requestPromise = this.firebase.getRequests(tokenId);
      const metadata = await metadataPromise;
      const ownerOf = await ownerOfPromise;
      const requests = await requestPromise;

      runInAction(() => {
        // console.info("callee reloadTokenDetail::runOnAction");
        this.tokenDetail = new TokenDetailStore(); //参照箇所わかりやすくするためnewしてる
        this.tokenDetail.name = metadata.name;
        this.tokenDetail.identity = metadata.identity;
        this.tokenDetail.description = metadata.description;
        this.tokenDetail.image = metadata.image;
        this.tokenDetail.createdAt = metadata.createdAt;
        this.tokenDetail.owner = ownerOf;
        this.tokenDetail.requests = requests;
        this.isLoadingDetail = false; //trueにするのはindex
      });
    } catch(err) {
      console.error(`detail:${err}`);
      this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  @action
  async reloadHome() {
    // const tokenIds = await this.ethereum.fetchAllTokenIds();
    // const metadataPromise = [];
    // for (let i = 0; i < tokenIds.length; i++) {
    //   metadataPromise.push(this.firebase.fetchMetadata(tokenIds[i]));
    // }
    // const metadata = await Promise.all(metadataPromise);
    // const tokenCards = [];
    // for (let i = 0; i < tokenIds.length; i++) {
    //   tokenCards.push({
    //     tokenId: tokenIds[i],
    //     name: metadata[i].name,
    //     image: metadata[i].image,
    //     createdAt: metadata[i].createdAt,
    //   });
    // }
    const tokenCards = await this.firebase.retrieveTokenList();
    runInAction(() => {
      this.tokenCards = tokenCards;
    });
  }

  isAddress = (hexString: string): boolean =>
    this.ethereum.isAddress(hexString);

  //web3 accountとfirebase authの双方が必要
  @computed
  get isAccountAvailable(): boolean {
    return !!this.accountAddress && this.isAddress(this.accountAddress);
  }

  sendRequest(tokenId: string, message: string) {
    if (!this.accountAddress) {
      throw new Error('this.accountAddress is null');
    }
    this.firebase.addRequest(this.accountAddress, tokenId, message);
  }
}

// Flow に return type を推論させると DRY でうれしいと思いきや，
// 「any に store が入っている型」に推論されてしまい，全くうれしくない
export type Store = {
  store: GlobalStore,
};

//export default () => new GlobalStore('0x4Ae7D4415D41Fd60c36Ef7DBD8F98a6F388FaeEc');
export default() => new GlobalStore(ContractAddress.contractAddress);