import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { spawn } from 'child-process-promise';

admin.initializeApp(functions.config().firebase);

export async function removeFile(path: string): Promise<void> {
  const bucket = admin.storage().bucket();
  await bucket.file(path).delete();
}

export async function isImageRequired(itemId: string): Promise<boolean> {
  const db = admin.firestore();
  const snapshot = await db.collection('items').doc(itemId).get();
  if (!snapshot.exists) {
    console.log(`item does not exist: itemId = ${itemId}`);
    return false;
  }
  if (snapshot.get('presence')) {
    console.log(`thumbnail already exists: itemId = ${itemId}`);
    return false;
  }
  return true;
}

export async function isValidItem(itemId: string): Promise<boolean> {
  const db = admin.firestore();
  const snapshot = await db.collection('items').doc(itemId).get();
  if (!snapshot.exists) {
    console.log(`item does not exist: itemId = ${itemId}`);
    return false;
  }
  if (!snapshot.get('presence')) {
    console.log(`thumbnail does not exist yet: itemId = ${itemId}`);
    return false;
  }
  return true;
}

export async function generateThumbnail(imageLocalPath: string, thumbLocalPath: string) {
  // -thumbnail を指定すると -strip になる
  // -thumbnail 384x384^ で短いほうの辺が384pxの長方形を作る（もともと小さい場合は無視）
  // -gravity center -extent 384x384 で中央だけ切り取る
  console.log(`Start to generate the thumbnail of ${imageLocalPath}`);
  await spawn('convert', [
    imageLocalPath,
    '-auto-orient',
    '-thumbnail',
    '384x384^',
    '-gravity',
    'center',
    '-extent',
    '384x384',
    thumbLocalPath,
  ]);
  console.log(`The thumbnail of ${imageLocalPath} is created at ${thumbLocalPath}`);
}

export async function downloadToLocal(bucketPath: string, localPath: string) {
  console.log(`Download ${bucketPath} -> ${localPath}`);
  const bucket = admin.storage().bucket();
  await bucket.file(bucketPath).download({ destination: localPath });
}

export async function uploadToBucket(localPath: string, bucketPath: string, contentType: string) {
  console.log(`Upload ${localPath} -> ${bucketPath}`);
  const bucket = admin.storage().bucket();
  // https://firebase.google.com/docs/reference/js/firebase.storage.UploadMetadata?hl=ja
  const metadata = {
    cacheControl: 'public, max-age=3600',
    contentType,
  };
  await bucket.upload(localPath, { destination: bucketPath, metadata });
}

export function makePublicUrl(bucketPath: string) {
  const bucket = admin.storage().bucket();
  // https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(bucketPath)}?alt=media`;
}

// 無くても調べられるけど，それはクライアントの責務じゃない
export async function appendUrl(itemId: string, url: string) {
  const db = admin.firestore();
  const { FieldValue } = admin.firestore;
  await db.collection('items').doc(itemId).update({
    imageURL: url,
    createdAt: FieldValue.serverTimestamp(),
    presence: true,
  })
}

export async function addItem(owner: string, name: string, description: string): Promise<string> {
  const db = admin.firestore();
  const ref = await db.collection('items').add({
    owner,
    name,
    description,
    presence: false,
  });
  return ref.id;
}

export async function addRequest(owner: string, client: string, itemId: string): Promise<string> {
  const db = admin.firestore();
  const { FieldValue } = admin.firestore;
  const ref = await db.collection('requests').add({
    owner,
    client,
    itemId,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}