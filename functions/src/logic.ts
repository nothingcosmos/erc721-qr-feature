import * as os from 'os';
import * as path from 'path';

import * as infrastructure from './infrastructure';

export async function addItem(owner: string, name: string, description: string): Promise<string> {
  console.log(`addItem(name = ${name}, description = ${description})`);
  return await infrastructure.addItem(owner, name, description);
}

export async function addRequest(owner: string, client: string, itemId: string, message: string): Promise<string> {
  console.log(`addRequest(owner = ${owner}, client = ${client}, itemId = ${itemId}, message = ${message})`);
  return await infrastructure.addRequest(owner, client, itemId, message);
}

export async function generateThumbnail(itemId: string, imagePath: string) {
  const thumbPath = `items/${itemId}.jpg`;
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
  await infrastructure.appendUrl(itemId, infrastructure.makePublicUrl(thumbPath));
}
