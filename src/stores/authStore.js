// @flow
import { observable, action, runInAction, reaction, autorun } from 'mobx';
import firebase from './firebase';
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
          this.fetchUser(this.token);
        }
      } else {
        window.localStorage.removeItem('erc721-qr-auth');
      }
    }
    );
  }

  @action
  async fetchUser(uid: string) {
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