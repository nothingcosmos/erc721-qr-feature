// @flow
import { observable, computed, configure, runInAction, action } from 'mobx';
import { isNullOrUndefined } from 'util';
import routerStore from './RouterStore';
import SnackbarStore from './SnackbarStore';
import Ethereum from './ethereum';
import FirebaseAgent from './firebase';
import ContractAddress from '../contracts/address.json';
import authStore from './authStore';
import CloudSignAgent from './cloudsign';

configure({ enforceActions: 'strict' });

type RequestItem = {
  requestId: string,
  client: string,
  uid: string,
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

  //lend
  @observable isLent = false;
  @observable lendOwner = '';
  @observable deadline = '';
  //escrow
  @observable escrowAddress = '';
}

export type TokenItem = {
  tokenId: string,
  name: string,
  image: string,
  createdAt: string,
  countRequest : number,
};

export class GlobalStore {
  serviceName: string = "ERC721QR feature";
  deployedNetwork: string = "Rinkeby";
  enableRental:bool = false;
  enableCloudSign:bool = false;
  enableEscrow:bool = true;

  @observable router = routerStore;//= new RouterStore(this);
  @observable snackbar = SnackbarStore;

  ethereum: Ethereum;
  @observable isWeb3Connected: boolean = false;
  @observable accountAddress: ?string = null;
  @observable networkName: ?string = null;
  @observable contractAddress: ?string = null;
  @observable tokenCards: TokenItem[] = [];
  @observable isLoadingCards: boolean = false;
  @observable tokenDetail: TokenDetailStore = new TokenDetailStore();
  @observable isLoadingDetail: boolean = false;

  firebase = FirebaseAgent;
  cloudsign = CloudSignAgent;

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

  async registerToken(name: string, identity: string, description: string, image: File) {
    try {
      if (!this.accountAddress) {
        throw new Error('Cannot get account');
      }
      if (!authStore.authUser) {
        throw new Error('AuthUser not found. please signIn.');
      }

      // Firebaseに書き込む
      this.snackbar.send('メタデータを書き込んでいます');
      const tokenId = await this.firebase.registerToken(
        this.accountAddress,
        name,
        description,
        identity
      );
      this.snackbar.send('画像をアップロードしています');
      await this.firebase.uploadImage(tokenId, image);
      const image_info = await this.firebase.fetchImageUrl(tokenId);

      // トランザクションを送信する
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しています`
      );
      const metadata = this.ethereum.createMetadata(tokenId, name, identity, description, image_info.image);
      await this.ethereum.mintWithMetadata(this.accountAddress, tokenId, metadata);
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しました`
      );
    } catch (err) {
      this.snackbar.send(`Errorが発生し、登録に失敗しました。detail=${err}`);
      console.error(err);
    };
    this.router.openHomePage();
  }

  async transfer(from: string, to: string, tokenId: string) {
    try {
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しています`
      );
      await this.ethereum.transfer(from, to, tokenId);
      await this.firebase.updateTokenOwner(tokenId, to);
      await this.deleteRequestsAll(tokenId); //古いのは全部消す
      this.snackbar.send(
        `${this.networkName || '(null)'} にトランザクションを送信しました`
      );
    } catch (err) {
      this.snackbar.send(`Errorが発生し、トランザクションに失敗しました。detail=${err}`);
      console.error(`detail:${err}`);
    }
  }

  async lend(from: string, to: string, tokenId: string, afterDays: number) {
    try {
      this.snackbar.send(
        `${this.networkName || '(null)'} にlendトランザクションを送信しています`
      );
      await this.ethereum.lend(from, to, tokenId, afterDays);
      await this.deleteRequestsAll(tokenId); //古いのは全部消す
      this.snackbar.send(
        `${this.networkName || '(null)'} にlendトランザクションを送信しました`
      );
    } catch (err) {
      this.snackbar.send(`Errorが発生し、トランザクションに失敗しました。detail=${err}`);
      console.error(`detail:${err}`);
    }
  }

  //todo tx失敗前のlendOwner確認をすべきか 
  async returnLendOwner(lendOwner: string, tokenId: string) {
    try {
      const notLending: boolean = await this.ethereum.notLent(tokenId);
      if (notLending) {
        this.snackbar.send(
          `${tokenId} は貸出状態にありません。`
        );
        return;
      }

      this.snackbar.send(
        `${this.networkName || '(null)'} にreturnLendOwnerトランザクションを送信しています`
      );
      await this.ethereum.returnLendOwner(lendOwner, tokenId);
      this.snackbar.send(
        `${this.networkName || '(null)'} にreturnLendOwnerトランザクションを送信しました`
      );
    } catch (err) {
      this.snackbar.send(`Errorが発生し、トランザクションに失敗しました。detail=${err}`);
      console.error(`detail:${err}`);
    }
  }

  async burn(from: string, tokenId: string) {
    this.snackbar.send(
      `${this.networkName || '(null)'} にburnトランザクションを送信しています`
    );
    await this.ethereum.burn(from, tokenId);
    this.snackbar.send(
      `${this.networkName || '(null)'} にburnトランザクションを送信しました`
    );
  }

  // removeなのでburnはせず、databaseのみ消去する。rejectはしない。
  async removeToken(ownerAddress: string, tokenId: string) {
    try {
      await this.firebase.removeToken(ownerAddress, tokenId);
      this.router.openHomePage();
    } catch (err) {
      this.snackbar.send(
        `${tokenId}の削除に失敗しました。detail=${err || '(null)'}`
      );
    }
  }

  async deleteRequestsAll(tokenId: string) {
    await this.firebase.rejectRequestsByTokenId(tokenId);
    this.reloadTokenDetail(tokenId);
  }

  async deleteRequest(tokenId: string, requestId: string) {
    await this.firebase.rejectRequest(requestId);
    this.reloadTokenDetail(tokenId);
  }

  async sendRequest(tokenId: string, message: string) {
    try {
      if (!this.accountAddress) {
        throw new Error('this.accountAddress is null');
      }
      if (!authStore.authUser) {
        throw new Error('authUser is null, please signIn.');
      }
      await this.firebase.addRequest(authStore.authUser.uid, this.accountAddress, tokenId, message);
      this.reloadRequests(tokenId);
    } catch (err) {
      console.error(`Failed sendRequest, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  async sendSignDocument(accessToken: string, tokenId: string, requestId: string, toId: string, message: string, email:string) {
    console.info(`callee ${accessToken}, ${message}`);
    console.info(`callee ${tokenId} ${requestId} ${toId} ${authStore.authUser.uid}`);
    try {
      await this.cloudsign.updateToken(accessToken);

      const title = this.serviceName + "レンタル契約書";
      const concatMessage = message + ", URL: " + this.router.getTokenLink(tokenId);

      //
      const doc = await this.cloudsign.createSignDocument(title, concatMessage, 2);
      doc.requestId = requestId;
      doc.requestUid = toId;
      doc.ownerUid = authStore.authUser.uid;
      doc.tokenId = tokenId;
      await this.firebase.saveSignDocument(doc);

      const toUser = await this.firebase.retrieveUser(toId);
      if (isNullOrUndefined(toUser)) {
        this.snackbar.send(`送信先のEmail取得に失敗しました。`);
        return;
      }

      //todo replace toUser.email
      //await this.cloudsign.addParticipants(doc, email);
      await this.cloudsign.updateParticipants(doc, doc.participants[1], email);

      console.info("postSignDocument");
      const status = await this.cloudsign.postSignDocument(doc);
      console.info("post status=" + status);

      doc.status = status;
      await this.firebase.saveSignDocument(doc);

    } catch (err) {
      console.error(`Failed signDocument, detail:${err}`);
      this.snackbar.send(`契約書の送付に失敗しました。`);
    }
  }

  //
  // Escrow
  //
  async createEscrow(tokenId: string, payer: string, eth:number, afterDealineDays:number) {
    try {
      const address = await this.ethereum.createEscrow(this.accountAddress, tokenId, eth, afterDealineDays, payer);
      console.info("escrow:"+address);
    } catch (err) {
      console.error(`Failed escrow, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  async resetEscrow(tokenId: string) {
    try {
      await this.ethereum.resetEscrow(this.accountAddress, tokenId);
      console.info("resetEscrow:"+tokenId);
    } catch (err) {
      console.error(`Failed escrow, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  async approveForEscrow(tokenId: string) {
    try {
      const address = await this.ethereum.escrowAddress(this.accountAddress, tokenId);
      console.info("escrow address=" + address);

      await this.ethereum.approveForEscrow(this.accountAddress, tokenId);
      console.info("approve");
    } catch (err) {
      console.error(`Failed escrow, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  async depositEscrow(tokenId: string, eth:number) {
    try {
      const address = await this.ethereum.escrowAddress(this.accountAddress, tokenId);
      console.info("deposit escrow address=" + address);

      await this.ethereum.depositEscrow(this.accountAddress, address, eth);
      console.info("deposit");
    } catch (err) {
      console.error(`Failed escrow, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  async transferEscrowPayer(tokenId:string, image: File) {
      try {
        if (!this.accountAddress) {
          throw new Error('Cannot get account');
        }
        if (!authStore.authUser) {
          throw new Error('AuthUser not found. please signIn.');
        }
        //approve済みか判定
        const ok = await this.ethereum.isApprovedForEscrow(this.accountAddress, tokenId);
        if (!ok) {
          this.snackbar.send(`Escrow決済が承認されていません`);
          return;
        }
  
        // Firebaseに書き込む
        this.snackbar.send('画像をアップロードしています');
        await this.firebase.uploadImage(tokenId, image);
        const image_info = await this.firebase.fetchImageUrl(tokenId);
  
        // トランザクションを送信する
        this.snackbar.send(
          `${this.networkName || '(null)'} にトランザクションを送信しています`
        );
        const token = await this.firebase.fetchToken(tokenId);
        console.info(token);

        const metadata = this.ethereum.createMetadata(tokenId, token.name, token.identity, token.description, image_info.image);
        console.info(metadata);
        await this.ethereum.transferEscrowPayer(this.accountAddress, tokenId, metadata);
        this.snackbar.send(
          `${this.networkName || '(null)'} にトランザクションを送信しました`
        );
      } catch (err) {
        this.snackbar.send(`Errorが発生し、登録に失敗しました。detail=${err}`);
        console.error(err);
      };
      this.router.openHomePage();
    }

  getEtherscanAddressUrl(accountAddress: string): string {
    return `https://${this.networkName}.etherscan.io/address/${accountAddress}`;
  }

  getEtherscanTxUrl(txhash: string): string {
    return `https://${this.networkName}.etherscan.io/tx/${txhash}`;
  }

  async beforeReloadTokenDetail(tokenId:string) {
    console.info(`callee reloadTokenDetail ${tokenId}`);
  }

  @action
  async reloadRequests(tokenId: string) {
    try {
      const requests = await this.firebase.getRequests(tokenId);
      runInAction(() => {
        if (!!this.tokenDetail) {
          this.tokenDetail.requests = requests;
        }
      });
    } catch (err) {
      console.error(`Failed reloadRequest, detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  //URLをparseして開く際に呼ばれる,他にdetailをクリックした際にも呼ばれる。 
  @action
  async reloadTokenDetail(tokenId: string) {
    this.isLoadingDetail = true;
    try {
      this.beforeReloadTokenDetail(tokenId);
      if (isNullOrUndefined(tokenId)) {
        throw new Error('Invalid tokenId');
      }

      const metadataPromise = this.ethereum.tokenURIAsMetadata(tokenId);
      const ownerOfPromise = this.ethereum.ownerOf(tokenId);
      const requestPromise = this.firebase.getRequests(tokenId);
      const metadata = await metadataPromise;
      const ownerOf = await ownerOfPromise;
      const requests = await requestPromise;

      const notLending: boolean = (this.enableRental) ? await this.ethereum.notLent(tokenId) : true;
      let lendOwner: string = '';
      let deadline: string = '';
      if (!notLending) {
        lendOwner = await this.ethereum.lendOwnerOf(tokenId);
        deadline = await this.ethereum.deadlineAsUTCString(tokenId);
      }

      const escrowAddress:string = (this.enableEscrow) ? await this.ethereum.escrowAddress(tokenId) : "";

      runInAction(() => {
        this.tokenDetail = new TokenDetailStore(); //参照箇所わかりやすくするためnewしてる
        this.tokenDetail.name = metadata.name;
        this.tokenDetail.identity = metadata.identity;
        this.tokenDetail.description = metadata.description;
        this.tokenDetail.image = metadata.image_url;
        //        this.tokenDetail.createdAt = metadata.createdAt;
        this.tokenDetail.owner = ownerOf;
        this.tokenDetail.requests = requests;

        //lend
        this.tokenDetail.isLent = !notLending;
        this.tokenDetail.lendOwner = lendOwner;
        this.tokenDetail.deadline = deadline;

        //escrow
        this.tokenDetail.escrowAddress = escrowAddress;
        this.isLoadingDetail = false; //trueにするのはrouterStore
      });
    } catch (err) {
      console.error(`detail:${err}`);
      //this.snackbar.send(`Errorが発生し、詳細の取得に失敗しました。detail=${err}`);
    }
  }

  //request数をカウントする。どこかにcacheすべきか。
  async countRequests(tokenId:string) : number {
    try {
      const c = await this.firebase.getCountRequest(tokenId);
      return c;
    } catch (err) {
      console.error("Failed updateRequestMap detail:${err}");
    }
    return 0;
  }

  @action
  async reloadMyItems() {
    this.isLoadingCards = true;
    const tokenCards = await this.firebase.retrieveTokenListByOwner(this.accountAddress);
    
    for (let i = 0; i< tokenCards.length; i++) {
      tokenCards[i].countRequest = await this.countRequests(tokenCards[i].tokenId);
    };
    runInAction(() => {
      this.tokenCards = tokenCards;
      this.isLoadingCards = false;
    });
  }

  @action
  async reloadHome() {
    //console.info(`callee reloadHome`);
    this.isLoadingCards = true;
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
      this.isLoadingCards = false;
    });
  }

  isAddress = (hexString: string): boolean =>
    this.ethereum.isAddress(hexString);

  //web3 accountとfirebase authの双方が必要にする？
  @computed
  get isAccountAvailable(): boolean {
    return !!this.accountAddress && this.isAddress(this.accountAddress) && (this.deployedNetwork == this.networkName);
  }
}

// Flow に return type を推論させると DRY でうれしいと思いきや，
// 「any に store が入っている型」に推論されてしまい，全くうれしくない
export type Store = {
  store: GlobalStore,
};

//export default () => new GlobalStore('0x4Ae7D4415D41Fd60c36Ef7DBD8F98a6F388FaeEc');
export default new GlobalStore(ContractAddress.contractAddress);