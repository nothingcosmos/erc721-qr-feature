// @flow
import { observable, action, runInAction, reaction, autorun } from 'mobx';
import firebase from './firebase';
import store from './index';
import { isNullOrUndefined } from 'util';
import snackbarStore from './SnackbarStore';

export type AuthUser = {
  uid: string, //firebase User uid
  displayName: string,
  email: string,
  photoURL: string,
  provider: string,
  //以下はoption
  providerId: string,
  accountAddress: string,
};

export class AuthStore {
  @observable authUser: ?AuthUser = null;
  @observable token = window.localStorage.getItem('erc721-qr-auth');
  @observable viewUser: ?AuthUser = null;

  constructor() {
    //reaction動かない、何かしらactionの伝搬に問題を抱えている
    // reaction(
    //   () => this.token,
    //   token => {
    //     console.info(`token:${token}`)
    //     if (token) {
    //       window.localStorage.setItem('erc721-qr-auth', token);
    //       if (isNullOrUndefined(this.authUser)) {
    //         console.info(`fetch User:${token}`);
    //       }
    //     } else {
    //       window.localStorage.removeItem('erc721-qr-auth');
    //     }
    //   }
    // );
    autorun(() => {
      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          this.token = result.credential.accessToken;
        }
        const provider_name = result.provider_name;
        const user = result.user;
        this.authUser =  {
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
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });


      //console.info(`autorun token:${this.token}, user:${this.authUser}`);
      if (!!this.token) {
        window.localStorage.setItem('erc721-qr-auth', this.token);
        if (isNullOrUndefined(this.authUser)) {
          //console.info(`fetch User:${this.token}`);
          this.fetchAuthUser(this.token);
        }
      } else {
        window.localStorage.removeItem('erc721-qr-auth');
      }
    }
    );
  }

  //他のユーザーを参照する
  @action
  async fetchViewUser(uid:string) {
    try {
      const user = await firebase.retrieveUser(uid);
      if (!isNullOrUndefined(user)) {
        runInAction(() => {
          this.viewUser = user;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  @action
  async fetchAuthUser(uid: string) {
    try {
      const user = await firebase.retrieveUser(uid);
      if (!isNullOrUndefined(user)) {
        runInAction(() => {
          this.authUser = user;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  @action
  async signin(provider: string) {
    try {
      const user = await firebase.openOAuth2(provider);
      if (!isNullOrUndefined(user)) {
        //console.info(user);
        runInAction(() => {
          this.authUser = user;
          this.token = user.uid;
        });
        //両方揃ってたらstore
        if (store.isAccountAvailable) {
          user.accountAddress = store.accountAddress;
        }
        console.info(store.isAccountAvailable);

        firebase.addUser(user);
        snackbarStore.send(`${user.displayName} SignIn.`);
      }
    } catch (err) {
      snackbarStore.send(
        `Failed to signin, detail:${err}`
      );
      console.error(err);
    }
  }

  @action
  signout() {
    this.authUser = null;
    this.token = null;;
  }
}

export default new AuthStore();