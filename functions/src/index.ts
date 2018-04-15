import * as functions from 'firebase-functions';
import * as util from 'ethereumjs-util';
import * as pathMatch from 'path-match';
import * as express from 'express';
import * as logic from './logic';
import * as infrastructure from './infrastructure';

exports.add_token = functions.https.onRequest(async (req, resp) => {
  const name: string = req.body.name;
  const description: string = req.body.description;

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

  const tokenId = await logic.addToken(name, description);
  resp.status(200).json({ tokenId });
});

exports.add_request = functions.https.onRequest(async (req, resp) => {
  const from: string = req.body.from;
  const tokenId: string = req.body.tokenId;
  const message: string = req.body.message;

  if (!util.isValidAddress(from)) {
    console.log(`'${from}' is not valid address.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  if (!(await infrastructure.isTokenExisting(tokenId))) {
    console.log(`'${tokenId}' is not valid token id.`)
    resp.sendStatus(400); // Bad Request
    return;
  }

  // TINYTEXT at MySQL
  if (message.length > 255) {
    console.log('message is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  const requestId = await logic.addRequest(from, tokenId, message);
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
  const match = pathMatch(matchOptions)('submit/:tokenId/:basename');
  const imagePath = object.name;
  const params = match(imagePath);
  // pending/:tokenId/:basename しか書き込みを許可してないから，ここで引っかかるのは
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
  const { tokenId } = params;
  // サムネイルを生成してよいかチェック
  if (!(await infrastructure.isImageRequired(tokenId))) {
    console.log(`an image is not required: tokenId = ${tokenId}`);
    return;
  }
  // サムネイルを生成
  await logic.generateThumbnail(tokenId, imagePath);
});

const app = express();
app.get('/erc721/:id', async (req, resp) => {
  const tokenId = req.params.id;
  if (!(await infrastructure.isTokenExisting(tokenId))) {
    console.log(`'${tokenId}' is not valid token id.`)
    resp.sendStatus(400); // Bad Request
    return;
  }
  const metadata = await infrastructure.getMetadata(tokenId);
  resp.set('Cache-Control', 'public, max-age=900');
  resp.status(200).json(metadata);
});

exports.erc721 = functions.https.onRequest(app);
