import * as os from 'os';
import * as path from 'path';

import * as infrastructure from './infrastructure';

export async function addToken(name: string, description: string): Promise<string> {
  console.log(`addToken(name = ${name}, description = ${description})`);
  return await infrastructure.addToken(name, description);
}

export async function addRequest(from: string, tokenId: string, message: string): Promise<string> {
  console.log(`addRequest(client = ${from}, tokenId = ${tokenId}, message = ${message})`);
  return await infrastructure.addRequest(from, tokenId, message);
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
