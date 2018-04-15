// @flow
import { observable, action } from 'mobx';

export default class SnackbarStore {
  @observable open = false;
  @observable message = '';

  @action.bound
  send(message: string) {
    this.message = message;
    this.open = true;
  }

  @action.bound
  close() {
    this.open = false;
  }
}
