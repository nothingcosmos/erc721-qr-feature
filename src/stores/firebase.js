// @flow
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import * as path from 'path';
import type TokenItem from 'index';

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

  async openOAuth2(provider_name:string) {
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
    firebase.auth().signInWithPopup(provier).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.info(user);
        return user;
      }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.error(errorCode + ":" + errorMessage);
      return null;
    });
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

  //upload先はpostImageであり,thumbnail化された後imagesへ
  async uploadImage(tokenId: string, image: File) {
    await this.initializerPromise;
    const basename = path.basename(image.name);
    const ref = this.storage.ref(`postImage/${tokenId}/${basename}`);
    await ref.put(image);
    return tokenId;
  }

  //erc721のリクエストが爆発している
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
}
