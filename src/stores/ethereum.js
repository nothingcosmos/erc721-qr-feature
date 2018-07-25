// @flow
import * as Web3 from 'web3';
//import contractABI from './ERC721QR-abi.json';
import contractABI from '../contracts/abi.json'; //truffle deploy時に生成


//rarebits準拠
//https://docs.rarebits.io/v1.0/docs/listing-your-assets
export type MetadataStandard = {
  name:string,
  identity:string, //写真でとったものに固有idがあれば付与する
  description:string,
  image_url:string,
  home_url:string,
  tags: string[],
}

export default class {
  apiEndpoint : string = "https://erc721-qr-feature.firebaseapp";
  hostingEndpoint : string = "https://erc721-qr-feature.firebaseapp.com";
  originalTag : string = "erc721-qr";
  contractInstance: any;

  constructor(address: string) {
    if (!window.web3) {
      alert('Please install https://metamask.io/');
      throw new Error(`Cannot find Web3.`);
    }
    window.web3 = new Web3(window.web3.currentProvider);
    this.setContractAddress(address);
  }

  setContractAddress(address: string) {
    this.contractInstance = window.web3.eth.contract(contractABI).at(address);
  }

  async getAccount(): Promise<?string> {
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err);
          return;
        }
        if (accounts.length === 0) {
          resolve(null);
          return;
        }
        const account = accounts[0];
        resolve(account);
      });
    });
  }

  async getNetwork(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.web3.version.getNetwork((err, netId) => {
        if (err) {
          reject(err);
          return;
        }
        switch (netId) {
          case '1':
            resolve('Mainnet');
            break;
          case '2':
            resolve('Morden');
            break;
          case '3':
            resolve('Ropsten');
            break;
          case '4':
            resolve('Rinkeby');
            break;
          case '42':
            resolve('Kovan');
            break;
          default:
            resolve('Unknown');
            break;
        }
      });
    });
  }

  async mint(owner: string, tokenId: string): Promise<void> {
    const tokenIdHash = window.web3.sha3(tokenId);
    const tokenIdHashBigNumber = window.web3.toBigNumber(tokenIdHash);
    const uri = `${this.apiEndpoint}/erc721/${tokenId}`;
    return new Promise((resolve, reject) => {
      this.contractInstance.mint(
        tokenIdHashBigNumber,
        uri,
        { from: owner },
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  // metadata = {name, description, identity, image_url, home_url, tags:[], }
  async mintWithMetadata(owner: string, tokenId: string, metadata: MetadataStandard): Promise<void> {
    const tokenIdHash = window.web3.sha3(tokenId);
    const tokenIdHashBigNumber = window.web3.toBigNumber(tokenIdHash);
    const metauri = JSON.stringify(metadata);
    return new Promise((resolve, reject) => {
      this.contractInstance.mint(
        tokenIdHashBigNumber,
        metauri,
        { from: owner },
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  createMetadata(tokenId:string, name:string, identity:string, description: string, imageUrl:string) : MetadataStandard {
    return {
        name:name,
        identity:identity,
        description:description,
        image_url:imageUrl,
        home_url:`${this.hostingEndpoint}/token/${tokenId}`,
        tags:["erc721-qr"],
    };
  }

  async ownerOf(tokenId: string): Promise<string> {
    const tokenIdHash = window.web3.sha3(tokenId);
    const tokenIdHashBigNumber = window.web3.toBigNumber(tokenIdHash);
    return new Promise((resolve, reject) => {
      this.contractInstance.ownerOf(tokenIdHashBigNumber, (err, owner) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(owner);
      });
    });
  }

  async totalSupply(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.contractInstance.totalSupply((err, totalSupply) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(totalSupply);
      });
    });
  }

  async tokenByIndex(index: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contractInstance.tokenByIndex(index, (err, tokenId) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokenId);
      });
    });
  }

  async tokenURI(tokenId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contractInstance.tokenURI(tokenId, (err, tokenURI) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokenURI);
      });
    });
  }

  async tokenMetadata(tokenId:string) : Promise<MetadataStandard> {
    return new Promise((resolve, reject) => {
      this.contractInstance.tokenURI(tokenId, (err, tokenURI) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(tokenURI));
      });
    });
  }

  async tokenIdByIndex(index: number): Promise<string> {
    const tokenId = await this.tokenByIndex(index);
    const tokenURI = await this.tokenURI(tokenId);
    const prefix = `${this.apiEndpoint}/erc721/`;
    return tokenURI.substr(prefix.length);
  }

  //deprecated
  async fetchAllTokenIds(): Promise<string[]> {
    const totalSupply = await this.totalSupply();
    const tokenIdsPromise = [];
    for (let i = totalSupply - 1; i >= 0; i--) {
      tokenIdsPromise.push(this.tokenIdByIndex(i));
    }
    return Promise.all(tokenIdsPromise);
  }

  async transfer(from: string, to: string, tokenId: string): Promise<void> {
    const tokenIdHash = window.web3.sha3(tokenId);
    const tokenIdHashBigNumber = window.web3.toBigNumber(tokenIdHash);
    return new Promise((resolve, reject) => {
      this.contractInstance.safeTransferFrom(
        from,
        to,
        tokenIdHashBigNumber,
        { from },
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  isAddress(hexString: string): boolean {
    return window.web3.isAddress(hexString);
  }
}
