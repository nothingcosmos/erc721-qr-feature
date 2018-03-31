import * as functions from 'firebase-functions';
import * as util from 'ethereumjs-util';
import * as pathMatch from 'path-match';
import * as express from 'express';
import * as logic from './logic';
import * as infrastructure from './infrastructure';

exports.add_item = functions.https.onRequest(async (req, resp) => {
  // 本当は署名もつけたい
  const owner: string = req.body.owner;
  const name: string = req.body.name;
  const description: string = req.body.description;

  if (!util.isValidAddress(owner)) {
    console.log(`'${owner}' is not valid address.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  if (!name) {
    console.log('name is empty.')
    resp.sendStatus(400); // Bad Request
    return;
  }

  // TINYTEXT at MySQL
  if (name.length > 255) {
    console.log('name is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  // TEXT at MySQL
  if (description.length > 65536) {
    console.log('description is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  const itemId = await logic.addItem(owner, name, description);
  resp.status(200).json({ itemId });
});

exports.add_requests = functions.https.onRequest(async (req, resp) => {
  // 本当は署名もつけたい
  const owner: string = req.body.owner;
  const client: string = req.body.client;
  const itemId: string = req.body.itemId;
  const message: string = req.body.message;

  if (!util.isValidAddress(owner)) {
    console.log(`'${owner}' is not valid address.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  if (!util.isValidAddress(client)) {
    console.log(`'${client}' is not valid address.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  if (!(await infrastructure.isValidItem(itemId))) {
    console.log(`'${itemId}' is not valid item id.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  // TINYTEXT at MySQL
  if (message.length > 255) {
    console.log('message is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  const requestId = await logic.addRequest(owner, client, itemId, message);
  resp.status(200).json({ requestId });
});

exports.generateThumbnail = functions.storage.object().onChange(async (event) => {
  const object = event.data;
  // move or delete
  if (object.resourceState === 'not_exists') {
    console.log(`Move or Delete: resourceState = ${object.resourceState}`);
    return;
  }
  // metadata change
  if (object.resourceState === 'exists' && object.metageneration > 1) {
    console.log(`change of metadata: resourceState = ${object.resourceState} and metageneration = ${object.metageneration}`);
    return;
  }
  // sensitive : case sensitive (default: false)
  // strict : does not ignore the trailing slash (default: false)
  // end : add '$' to end of RegExp
  const matchOptions = { sensitive: true, strict: true, end: true };
  const match = pathMatch(matchOptions)('pending/:itemId/:basename');
  const imagePath = object.name;
  const params = match(imagePath);
  // pending/:itemId/:basename しか書き込みを許可してないから，ここで引っかかるのは
  // 生成されたサムネイルだけのはず…？
  if (params === false) {
    console.log(`path does not match: object.name = ${imagePath}`);
    return;
  }
  if (!object.contentType.startsWith('image/')) {
    console.log(`contentType does not match: contentType = ${object.contentType}`);
    // ファイルを削除
    await infrastructure.removeFile(imagePath);
    return;
  }
  const { itemId } = params;
  // サムネイルを生成してよいかチェック
  if (await infrastructure.isImageRequired(itemId)) {
    console.log(`an image is not required: itemId = ${itemId}`);
    return;
  }
  // サムネイルを生成
  await logic.generateThumbnail(itemId, imagePath);
});

const app = express();
app.get('/erc721/:id', async (req, resp) => {
  const itemId = req.body.id;
  if (!(await infrastructure.isValidItem(itemId))) {
    console.log(`'${itemId}' is not valid item id.`)
    resp.sendStatus(400); // Bad Request
    return;
  }
  const data = await infrastructure.getMetadata(itemId);
  const metadata = {
    title: 'Asset Metadata',
    type: 'object',
    properties: {
      'name': {
        'type': 'string',
        "description": data.name,
      },
      "description": {
        "type": "string",
        "description": data.description,
      },
      "image": {
        "type": "string",
        "description": data.image,
      }
    }
  };
  resp.status(200).json(metadata);
});

exports.erc721 = functions.https.onRequest(app);
