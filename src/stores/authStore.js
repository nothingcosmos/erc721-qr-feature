// @flow
import { observable, action, runInAction, reaction, autorun } from 'mobx';
import firebase from './firebase';
import store from '.';
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
  @observable token = window.localStorage.getItem(store.serviceName);
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
      //console.info(`autorun token:${this.token}, user:${this.authUser}`);
      if (!!this.token) {
        window.localStorage.setItem(store.serviceName, this.token);
        if (isNullOrUndefined(this.authUser)) {
          //console.info(`fetch User:${this.token}`);
          this.fetchAuthUser(this.token);
        } else {
          //console.info("change token, already auth.");
        }
      } else {
        window.localStorage.removeItem(store.serviceName);
      }
    }
    );
  }

  //他のユーザーを参照する
  @action
  async fetchViewUser(uid: string) {
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
        this.notifyAuthUser(user);
      }
    } catch (err) {
      console.error(err);
    }
  }

  @action
  async fetchOAuthRedirect() {
    try {
      if (!!this.authUser || !this.isMobile()) {
        return;
      }

      //initializeをsleepまち
      if (!firebase.initialized) {
          await firebase.sleepByPromise(1);
      }

      const user = await firebase.fetchRedirectResult();
      if (!isNullOrUndefined(user)) {
        this.notifyAuthUser(user);
        snackbarStore.send(`${user.displayName} SignIn.`);
      } else {
        console.error("Failed redirectOAuth.");
      }
    } catch (err) {
      console.error(`Failed fetchRedirect : ${err}`);
    }
  }

  notifyAuthUser(user:AuthUser) {
    if (!!store.accountAddress) {
      user.accountAddress = store.accountAddress;
      //console.info(user);
      firebase.addUser(user);
    }
    runInAction(() => {
      this.authUser = user;
      this.token = user.uid;
    });
  }

  isMobile(): boolean {
    var ua = navigator.userAgent;
    if ((ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) 
      && ua.indexOf('Mobile') > 0) {
      return true;
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return false;
    } else {
      return false;
    }
  }

  @action
  async openOAuth(provider: string) {
    try {
      //mobileは別タブを開かずにredirectで戻す
      if (this.isMobile()) {
        await firebase.redirectOAuth(provider);
        return;
      }

      const user = await firebase.openOAuth(provider);
      if (!isNullOrUndefined(user)) {
        this.notifyAuthUser(user);
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
  signInEmailPassword(email:string, password:string, create:boolean) {
    try {
      firebase.signInUser(email, password, create);
    } catch (err) {
      var errorCode = err.code;
      var errorMessage = err.message;
      snackbarStore.send(err.message);
      console.error("detail : " + errorMessage);
    }
  }

  //@action
  //todo PasswordReset

  @action
  signout() {
    this.authUser = null;
    this.token = null;
    firebase.signOut();
  }
}

export default new AuthStore();