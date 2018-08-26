// @flow
import { isNullOrUndefined } from 'util';
import authStore from './authStore';
import * as path from 'path';
import type TokenItem from 'index';
import type AuthUser from './authStore';

export type SignDocument = {
  id : string;
  title: string;
  message:string;
  participant0 : string;
  participant1 : string;
  status:number;
  //
  ownerUid:string;
  requestId:string;
  requestUid:string;
};

//cloudsign api
//https://app.swaggerhub.com/api/CloudSign/cloudsign-web_api/
//
export class CloudSignAgent {
  //todo 以下のパラメータはsandboxに向いてる
  endpoint : string = "https://api-sandbox.cloudsign.jp/";
  clientId : string = "97a3e2b6-fce4-400b-8094-3d4b178e6aa6";
  templateId = "2bd1d014-04af-4b30-963d-4dd5e2bf739b";

  token : string = "";

  constructor() {
  }

  json2form(data) : FormData {
    const form = new FormData();
    Object
      .keys(data)
      .forEach(key => form.append(key, data[key]));
    return form;
  }

  async template(url: string, value: any) {
    const method = 'PUT';
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(value);
    const init = {
      method,
      headers,
      body,
      mode : "cors",
    };
    const response = await fetch(url, init);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response);
  }

  async getSignDocument(doc:SignDocument) : Promise<number> {
    const api = this.endpoint + `documents/${doc.id}`;
    const method = 'GET';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
    };

    const init = {
      method,
      headers,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      const ret = await response.json();
      return ret.status;
    }
    throw new Error(response);
  }

  async postSignDocument(doc:SignDocument): Promise<number> {
    const api = this.endpoint + `documents/${doc.id}`;
    const method = 'POST';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const init = {
      method,
      headers,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      const ret = await response.json();
      return ret.status;
    }
    throw new Error(response);
  }

  async getSignDocuments() {
    const api = this.endpoint + "documents";
    const method = 'GET';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
    };

    const init = {
      method,
      headers,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response);
  }

  async createSignDocument(title:string, message:string) : Promise<SignDocument> {
    const api = this.endpoint + "documents";
    const method = 'POST';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const form = new FormData();
    form.append("title", encodeURIComponent(title));
    form.append("message", encodeURIComponent(message));
    form.append("template_id", this.templateId);
    form.append("can_transfer", "false");

    const init = {
      method,
      headers,
      body:form,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      const ret = await response.json();
      console.info(ret);

      const list = ret.participants;
      // if (list.length != 2) {
      //    throw new Error("Invalid template, paticipants is not 2.");
      // }
      return {
        id:ret.id,
        title:ret.title,
        message:ret.message,
        status:ret.status,
        participant0 : list[0].id,
        participant1 :"",
        ownerUid:"",
        requestId:"",
        requestUid:"",
      };
    }
    throw new Error(response);
  }

  async updateFrom(doc:SignDocument, email:string) {
    const api = this.endpoint + `documents/${doc.id}/participants/${doc.participant0}`;
    const method = 'PUT';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const form = new FormData();
    form.append("email", email);
    form.append("name", email);

    const init = {
      method,
      headers,
      body:form,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response);
  }

  async updateTo(doc:SignDocument, email:string) {
    const api = this.endpoint + `documents/${doc.id}/participants/${doc.participant1}`;
    const method = 'PUT';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const form = new FormData();
    form.append("email", email);
    form.append("name", email);

    const init = {
      method,
      headers,
      body:form,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response);
  }

  async addParticipant(doc:SignDocument, email:string) {
    const api = this.endpoint + `documents/${doc.id}/participants/`;
    const method = 'POST';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const form = new FormData();
    form.append("email", encodeURIComponent(email));
    form.append("name", encodeURIComponent(email));

    const init = {
      method,
      headers,
      body:form,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response);
  }

  async fetchToken() {
    const api = this.endpoint + "token?client_id=" + this.clientId;
    const headers = {
      'accept': 'application/json',
    };
    const init = {
      method:"GET",
      headers,
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return response.json();
    }
    console.info("failed fetch token.");
    throw new Error(response);
  }

  //todo fetchTokenはcorsが無許可なので、functionsで取得しないといけない
  async updateToken(accessToken:string) {
    //const json = await this.fetchToken();
    //this.token = json.access_token;
    this.token = accessToken;
  }

  /// 以降logic
}

export default new CloudSignAgent();