// @flow
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import * as path from 'path';

export default class {
  db: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  initializerPromise: Promise<void>;

  constructor() {
    this.initializerPromise = this.initializeApp();
  }

  async initializeApp() {
    // https://firebase.google.com/docs/web/setup
    const resp = await fetch('/__/firebase/init.json');
    const config = await resp.json();
    firebase.initializeApp(config);
    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true });
    this.storage = firebase.storage();
  }

  async postJson(url: string, value: any) {
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(value);
    const init = {
      method,
      headers,
      body,
    };
    const response = await fetch(url, init);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response);
  }

  async getJson(url: string) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response);
  }

  async registerToken(
    owner: string,
    name: string,
    description: string
  ): Promise<string> {
    await this.initializerPromise;
    const { tokenId } = await this.postJson('/api/add_token', {
      owner,
      name,
      description,
    });
    return tokenId;
  }

  async uploadImage(tokenId: string, image: File) {
    await this.initializerPromise;
    const basename = path.basename(image.name);
    const ref = this.storage.ref(`postImage/${tokenId}/${basename}`);
    await ref.put(image);
    return tokenId;
  }

  async fetchMetadata(tokenId: string) {
    const data = await this.getJson(`/erc721/${tokenId}`);
    return {
      name: data.name,
      description: data.description,
      image: data.image,
      createdAt: data.createdAt,
    };
  }

  async addRequest(
    from: string,
    tokenId: string,
    message: string
  ): Promise<void> {
    await this.initializerPromise;
    await this.postJson('/api/add_request', {
      from,
      tokenId,
      message,
    });
  }

  async getRequests(tokenId: string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('requests')
      .where('tokenId', '==', tokenId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        client: data.client,
        tokenId: data.tokenId,
        message: data.message,
        createdAt: data.createdAt.toDate().toUTCString(),
      };
    });
  }
}
