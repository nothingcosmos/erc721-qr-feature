import * as functions from 'firebase-functions';
import * as util from 'ethereumjs-util';
import * as pathMatch from 'path-match';
import * as express from 'express';
import * as logic from './logic';
import * as infrastructure from './infrastructure';

exports.add_token = functions.https.onRequest(async (req, resp) => {
  const name: string = req.body.name;
  const identity: string = req.body.identity;
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

  if (identity.length > 255) {
    console.log('identity is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  // TEXT at MySQL
  if (description.length > 65536) {
    console.log('description is too long.');
    resp.sendStatus(400); // Bad Request
    return;
  }

  const tokenId = await logic.addToken(name, identity, description);
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

exports.generateThumbnail = functions.storage.object().onFinalize(async (object, context) => {
  // アップロードされたパスのチェック
  // sensitive : case sensitive (default: false)
  // strict : does NOT ignore the trailing slash (default: false)
  // end : add '$' to end of RegExp
  const matchOptions = { sensitive: true, strict: true, end: true };
  const match = pathMatch(matchOptions)('postImage/:tokenId/:basename');
  const imagePath = object.name;
  const params = match(imagePath);
  // postImage/:tokenId/:basename しか書き込みを許可してないから，ここで引っかかるのは
  // 生成されたサムネイルだけのはず…？
  if (params === false) {
    console.log(`path does not match: object.name = ${imagePath}`);
    return;
  }

  // アップロードされたファイルのチェック
  if (!object.contentType.startsWith('image/')) {
    console.log(`contentType does not match: contentType = ${object.contentType}`);
    // ファイルを削除
    await infrastructure.removeFile(imagePath);
    return;
  }

  // サムネイルを生成してよいかチェック
  const { tokenId } = params;
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
    console.error(`'${tokenId}' is not valid token id.`)
    resp.sendStatus(400); // Bad Request
    return;
  }
  const metadata = await infrastructure.getMetadata(tokenId);
  resp.set('Cache-Control', 'public, max-age=900');
  resp.status(200).json(metadata);
});
app.get('/erc721/:id/image_url', async (req, resp) => {
  const tokenId = req.params.id;
  const imageUrl = logic.imageUrl(tokenId);
  console.log(`response imageUrl: tokenId = ${tokenId}, image = ${imageUrl}`);
  const ret = {
    tokenId:tokenId,
    image:imageUrl,
  };
  resp.set('Cache-Control', 'public, max-age=900');
  resp.status(200).json(ret);
});

exports.erc721 = functions.https.onRequest(app);
