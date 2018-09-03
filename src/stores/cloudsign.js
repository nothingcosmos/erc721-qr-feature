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
  participants : string[];
  status:number;
  //
  ownerUid:string;
  requestId:string;
  requestUid:string;
  tokenId:string;
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

  json2form_urlencoded(obj) : string {
    return Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&");
  }

  async getSignDocumentStatus(doc:SignDocument) : Promise<number> {
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
      //console.info("detail:" + JSON.stringify(ret));
      return ret.status;
    }
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
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
      //console.info("postDocument=" + JSON.stringify(ret));
      return ret.status;
    }
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
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
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
  }

  async createSignDocument(title:string, message:string, requiredParNum:number) : Promise<SignDocument> {
    const api = this.endpoint + "documents";
    const method = 'POST';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = {
      title:title,
      message:message,
      template_id:this.templateId,
      can_transfer:false,
    }

    const init = {
      method,
      headers,
      body: this.json2form_urlencoded(params),
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      const ret = await response.json();
      //console.info(ret);

      const list = ret.participants;
      if (list.length != requiredParNum) {
        throw new Error("Invalid template, paticipants is not " + requiredParNum);
      }
      return {
        id:ret.id,
        title:ret.title,
        message:ret.message,
        status:ret.status,
        participants : list.map((p) => p.id),
        ownerUid:"",
        requestId:"",
        requestUid:"",
        tokenId:"",
      };
    }
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
  }

  async updateParticipants(doc:SignDocument, participantsId:string, email:string) {
    const api = this.endpoint + `documents/${doc.id}/participants/${participantsId}`;
    const method = 'PUT';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = {
      name:email,
      email:email,
    }

    const init = {
      method,
      headers,
      body:this.json2form_urlencoded(params),
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    //console.info("err:" + err);
    throw new Error(response);
  }  

  async addParticipants(doc:SignDocument, email:string) {
    const api = this.endpoint + `documents/${doc.id}/participants`;
    const method = 'POST';
    const headers = {
      'accept': 'application/json',
      'Authorization':'Bearer ' + this.token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = {
      name:email,
      email:email,
    }

    const init = {
      method,
      headers,
      body: this.json2form_urlencoded(params),
      mode : "cors",
    };
    const response = await fetch(api, init);
    if (response.ok) {
      return await response.json();
    }
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
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
    const errbody = await response.json();
    const err = `${response.status}:${JSON.stringify(errbody)}`;
    throw new Error(err);
  }

  //todo fetchTokenはcorsが無許可なので、functionsで取得しないといけない
  async updateToken(accessToken:string) {
    //const json = await this.fetchToken();
    //this.token = json.access_token;
    this.token = accessToken;
  }
}

export default new CloudSignAgent();