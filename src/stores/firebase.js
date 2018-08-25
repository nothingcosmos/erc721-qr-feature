// @flow
import * as firebase from 'firebase';
import 'firebase/firestore/dist/index.cjs';
import 'firebase/storage/dist/index.cjs';
import 'firebase/auth/dist/index.cjs';
import { isNullOrUndefined } from 'util';
import authStore from './authStore';
import * as path from 'path';
import type TokenItem from 'index';
import type AuthUser from './authStore';


export class FirebaseAgent {
  db: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  initializerPromise: Promise<void>;
  initialized : boolean = false;

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
    this.initialized = true;
    console.info("firebase initialized.");
    this.setAuthHandler();
  }

  async sleepByPromise(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
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

  setAuthHandler() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.info("handle :"+user);
        const authUser = {
            uid: user.uid,
            displayName: isNullOrUndefined(user.displayName) ? user.email : user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            provider: isNullOrUndefined(user.provider) ? "firebase" : user.provider,
        };
        authStore.notifyAuthUser(authUser);
        //console.info(authUser);
      } else {
        console.info("handle singout???");
      }
    });
  }

  async fetchRedirectResult() : Promise<?AuthUser> {
    return firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
//        console.log(`token : ${result.credential.accessToken}`);
      }
      const user = result.user;
      return {
          uid:user.uid,
          displayName:user.displayName,
          email:user.email,
          photoURL:user.photoURL,
          provider:user.provider_name,
      };
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorCode + ":" + errorMessage);
      return null;
    });
  }

  newAuthProvider(provider_name: string) {
    switch (provider_name) {
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
  }

  async redirectOAuth(provider_name: string): Promise<?AuthUser> {
    const provider = this.newAuthProvider(provider_name);
    return firebase.auth().signInWithRedirect(provider).then(function (result) {
      const user = result.user;
      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: provider_name,
      };
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorCode + ":" + errorMessage);
      return null;
    });
  }

  async openOAuth(provider_name: string): Promise<?AuthUser> {
    const provider = this.newAuthProvider(provider_name);
    return firebase.auth().signInWithPopup(provider).then(function (result) {
      const user = result.user;
      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: provider_name,
      };
    }).catch(function (error) {
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

  async signInUser(email:string, password:string, create:boolean)  {
    if (create) {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        throw new Error(error);
      });
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        throw new Error(error);
      });
    }    
  }

  async signOut() {
    firebase.auth().signOut();
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

  //databaseのtokensから取得する
  //thumbnail未生成の場合400を返すので、登録直後は叩いてはいけない
  async fetchToken(tokenId: string) {
    const data = await this.getJson(`/erc721/${tokenId}`);
    return {
      name: data.name,
      identity:data.identity,
      description: data.description,
      image: data.image,
      createdAt: data.createdAt,
    };
  }

  //thumbnail生成と並行してurlを取得する
  //本来ならthumbnail生成が完了しないとurlが取得できないため、予約済みのurlを取得する。
  async fetchImageUrl(tokenId: string) {
    const data = await this.getJson(`/erc721/${tokenId}/image_url`);
    return {
      tokenId: data.tokenId,
      image: data.image,
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

  async retrieveTokenListByOwner(owner: string) : TokenItem[] {
      await this.initializerPromise;
      const snapshot = await this.db
        .collection('tokens')
        .where('owner', '==', owner)
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

  async updateTokenOwner(tokenId:string, newOwner:string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('tokens').doc(tokenId);
      
    await snapshot.set({
      owner:newOwner,
    }, {merge: true});
  }

  //owenerAddressは現状参照されない
  async removeToken(ownerUid: string, tokenId: string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('tokens')
      .doc(tokenId)
      .delete().then(() => {
        console.info(`Succeed removeToken : ${tokenId}`);
      }).catch((err)=> {
        console.error(`Failed removeToken, detail : ${err}`);
      }) ;
  } 

  async addRequest(
    uid:string,
    from: string,
    tokenId: string,
    message: string
  ): Promise<void> {
    await this.initializerPromise;
    await this.postJson('/api/add_request', {
      uid,
      from,
      tokenId,
      message,
    });
  }

  async deleteRequest(requestId:string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('requests').doc(requestId).delete().then(() => {
          console.info(`Succeed deleteRequest : ${requestId}`);
      }).catch((err) => {
          console.error(`Failed deleteRequest : ${err}`);
      });
  }

  async rejectRequest(requestId:string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('requests').doc(requestId);
      
    await snapshot.set({
      reject:true,
    }, {merge: true});
  }

  async getRequests(tokenId: string) {
    await this.initializerPromise;
    const snapshot = await this.db
      .collection('requests')
      .where('tokenId', '==', tokenId).where('reject', '==', false)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        requestId: doc.id,
        client: data.client,
        uid: data.uid,
        tokenId: data.tokenId,
        message: data.message,
        createdAt: data.createdAt.toDate().toUTCString(),
      };
    });
  }

  async addUser(user): Promise<void> {
    console.info("add users:"+user.uid);
    await this.initializerPromise;
    await this.db.collection('users').doc(user.uid).set(user, { merge: true });
    return;
  }

  async updateUserAccountAddress(uid:string, accountAddress:string) : Promise<void> {
    await this.initializerPromise;
    await this.db.collection('users').doc(uid).set({accountAddress:accountAddress}, { merge: true });
    return;
  }

  async retrieveUser(uid:string) : Promise<?AuthUser> {
    await this.initializerPromise;
    const snapshot = await this.db.collection('users').doc(uid).get();
    if (!snapshot.exists) {
      return null;
    }
    const data = snapshot.data();
    return {
      uid:data.uid,
      displayName:data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      provider: data.provider,
      accountAddress: data.accountAddress,
    };
  }
}

export default new FirebaseAgent();