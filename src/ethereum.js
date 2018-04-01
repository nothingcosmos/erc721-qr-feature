// @flow
import * as Web3 from 'web3';
import contractABI from './ERC721QR-abi.json';

const contractAddress = '0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab';

export default class {
  contractInstance: any;
  constructor() {
    if (!window.web3) {
      throw new Error(`Cannot find Web3.`);
    }
    window.web3 = new Web3(window.web3.currentProvider);
    this.contractInstance = window.web3.eth
      .contract(contractABI)
      .at(contractAddress);
  }

  async getAccount(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err);
          return;
        }
        if (accounts.length === 0) {
          reject('There are no accounts.');
          return;
        }
        const account = accounts[0];
        resolve(account);
      });
    });
  }

  async mint(owner: string, tokenId: string): Promise<void> {
    const tokenIdHash = window.web3.sha3(tokenId);
    const tokenIdHashBigNumber = window.web3.toBigNumber(tokenIdHash);
    const uri = `https://erc721-qr.firebaseapp.com/erc721/${tokenId}`;
    return new Promise((resolve, reject) => {
      this.contractInstance.mint(
        owner,
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
