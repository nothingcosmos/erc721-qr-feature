// @flow
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import * as path from 'path';
import type TokenItem from 'index';
import type AuthUser from 'index';

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

  async openOAuth2(provider_name:string) : Promise<?AuthUser> {
    const provier = (() => {
      switch(provider_name) {
        case "google":
          return new firebase.auth.GoogleAuthProvider();
        case "twitter":
          return new firebase.auth.TwitterAuthProvider();
        case "facebook":
          return new firebase.auth.FacebookAuthProvider();
        case "github":
          return new firebase.auth.GithubAuthProvider();
        //todo
        //SMSによる認証もある
        default:
          return new firebase.auth.TwitterAuthProvider();
      }
    })();
    return firebase.auth().signInWithPopup(provier).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      //var token = result.credential.accessToken;
      //var secret = result.credential.secret;
      // The signed-in user info.
      const user = result.user;
      return {
          uid:user.uid,
          displayName:user.displayName,
          email:user.email,
          photoURL:user.photoURL,
          provider:provider_name,
      };
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      // ...
      console.error(errorCode + ":" + errorMessage);
      return null;
    });
  }

  async registerToken(
    owner: string,
    name: string,
    description: string,
    identity: string
  ): Promise<string> {
    await this.initializerPromise;
    const { tokenId } = await this.postJson('/api/add_token', {
      owner,
      name,
      description,
      identity,
    });
    return tokenId;
  }

  //upload先はpostImageであり,thumbnail化された後imagesへ
  async uploadImage(tokenId: string, image: File) {
    await this.initializerPromise;
    const basename = path.basename(image.name);
    const ref = this.storage.ref(`postImage/${tokenId}/${basename}`);
    await ref.put(image);
    return tokenId;
  }

  //erc721のリクエストが爆発しやすい
  async fetchMetadata(tokenId: string) {
    const data = await this.getJson(`/erc721/${tokenId}`);
    return {
      name: data.name,
      description: data.description,
      image: data.image,
      createdAt: data.createdAt,
    };
  }

  //startAtとendAtの同時使用は動かなかった
  async retrieveTokenList(offset:number = 0, limit:number = 25) : TokenItem[] {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('tokens')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const tokenId = doc.id;
      const data = doc.data();
      return {
        tokenId: tokenId,
        name:data.name,
        image:data.imageURL,
        createdAt: data.createdAt.toDate().toUTCString(),
      };
    });
  }

  async retrieveTokenListByOwner(ownerAddress: string) : TokenItem[] {
      await this.initializerPromise;
      const snapshot = await this.db
        .collection('tokens')
        .where('ownerAddress', '==', ownerAddress)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => {
        const tokenId = doc.id;
        const data = doc.data();
        return {
          tokenId: tokenId,
          name:data.name,
          image:data.imageURL,
          createdAt: data.createdAt.toDate().toUTCString(),
        };
      });
  }

  //owenerAddressは現状参照されない
  async removeToken(ownerAddress: string, tokenId: string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('tokens')
      .doc(tokenId)
      .delete();
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

  async addUser(user): Promise<void> {
    await this.initializerPromise;
    await this.db.collection('users').doc(user.uid).set(user, { merge: true });
    return;
  }

  async retrieveUser(uid:string) : Promise<AuthUser> {
    await this.initializerPromise;
    return await this.db.collection('users').doc(uid).get();
  }
}
