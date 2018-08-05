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
      //console.info(`autorun token:${this.token}, user:${this.authUser}`);
      if (!!this.token) {
        window.localStorage.setItem('erc721-qr-auth', this.token);
        if (isNullOrUndefined(this.authUser)) {
          //console.info(`fetch User:${this.token}`);
          this.fetchAuthUser(this.token);
        } else {
          //console.info("change token, already auth.");
        }
      } else {
        window.localStorage.removeItem('erc721-qr-auth');
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
        runInAction(() => {
          this.authUser = user;
          //this.tokenはsetしない
        });
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
      const user = await firebase.fetchRedirectResult();
      //const user = null;
      console.info(user);
      if (!isNullOrUndefined(user)) {
        runInAction(() => {
          console.info("update user from redirect");
          this.authUser = user;
          this.token = user.uid;
        });
        //両方揃ってたらstore
        if (store.isAccountAvailable) {
          user.accountAddress = store.accountAddress;
        }

        firebase.addUser(user);
        snackbarStore.send(`${user.displayName} SignIn.`);
      } else {
        console.error("Failed redirectOAuth.");
      }
    } catch (err) {
      console.error(`Failed fetchRedirect : ${err}`);
    }
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
  async signin(provider: string) {
    try {
      if (this.isMobile()) {
        await firebase.redirectOAuth(provider);
        return;
      }

      const user = await firebase.openOAuth(provider);
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