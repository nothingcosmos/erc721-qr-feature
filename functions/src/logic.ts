import * as os from 'os';
import * as path from 'path';

import * as infrastructure from './infrastructure';

export async function addToken(owner:string, name: string, identity:string, description: string): Promise<string> {
  console.log(`addToken(owner = ${owner}, name = ${name}, identity = ${identity}, description = ${description})`);
  return await infrastructure.addToken(owner, name, identity, description);
}

export async function addRequest(uid:string, from: string, tokenId: string, message: string): Promise<string> {
  console.log(`addRequest(uid = ${uid}, client = ${from}, tokenId = ${tokenId}, message = ${message})`);
  return await infrastructure.addRequest(uid, from, tokenId, message);
}

export async function generateThumbnail(tokenId: string, imagePath: string) {
  const thumbPath = `images/${tokenId}.jpg`;
  console.log(`generateThumbnail(imagePath = ${imagePath}, thumbPath = ${thumbPath})`);
  const imageLocalPath = path.join(os.tmpdir(), path.basename(imagePath));
  // 重複しそうだったのでthumb_を追加した
  const thumbLocalPath = path.join(os.tmpdir(), 'thumb_' + path.basename(thumbPath));
  // 画像ファイルをStorageからローカルにダウンロード
  await infrastructure.downloadToLocal(imagePath, imageLocalPath);
  // サムネイルを生成
  await infrastructure.generateThumbnail(imageLocalPath, thumbLocalPath);
  // サムネイルをローカルからStorageにアップロード
  await infrastructure.uploadToBucket(thumbLocalPath, thumbPath, 'image/jpeg');
  // 元ファイルを削除
  await infrastructure.removeFile(imagePath);
  // Firestoreに画像のURLを書き込み
  await infrastructure.appendUrl(tokenId, infrastructure.makePublicUrl(thumbPath));
}

export function imageUrl(tokenId:string) : string {
  const thumbPath = `images/${tokenId}.jpg`;
  return infrastructure.makePublicUrl(thumbPath);
}
