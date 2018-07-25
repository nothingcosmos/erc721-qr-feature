import * as admin from 'firebase-admin';
import { spawn } from 'child-process-promise';

admin.initializeApp();
const db = admin.firestore();

export async function removeFile(path: string): Promise<void> {
  const bucket = admin.storage().bucket();
  await bucket.file(path).delete();
}

export async function isImageRequired(tokenId: string): Promise<boolean> {
  const snapshot = await db.collection('tokens').doc(tokenId).get();
  if (!snapshot.exists) {
    console.log(`token does not exist: tokenId = ${tokenId}`);
    return false;
  }
  if (snapshot.get('presence')) {
    console.log(`thumbnail already exists: tokenId = ${tokenId}`);
    return false;
  }
  return true;
}

export async function isTokenExisting(tokenId: string): Promise<boolean> {
  const snapshot = await db.collection('tokens').doc(tokenId).get();
  if (!snapshot.exists) {
    console.log(`token does not exist: tokenId = ${tokenId}`);
    return false;
  }
  if (!snapshot.get('presence')) {
    console.log(`thumbnail does not exist yet: tokenId = ${tokenId}`);
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
export async function appendUrl(tokenId: string, url: string) {
  const { FieldValue } = admin.firestore;
  await db.collection('tokens').doc(tokenId).update({
    imageURL: url,
    createdAt: FieldValue.serverTimestamp(),
    presence: true,
  })
}

export async function addToken(name: string, identity:string, description: string): Promise<string> {
  const ref = await db.collection('tokens').add({
    name,
    identity,
    description,
    presence: false,
  });
  return ref.id;
}

export async function addRequest(client: string, tokenId: string, message: string): Promise<string> {
  const { FieldValue } = admin.firestore;
  const ref = await db.collection('requests').add({
    client,
    tokenId,
    message,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getMetadata(tokenId: string) {
  console.log(`getMetadata(tokenId = ${tokenId})`);
  const ref = await db.collection('tokens').doc(tokenId).get();
  const data = ref.data();
  return {
    name: data.name,
    identity: data.identity,
    description: data.description,
    image: data.imageURL,
    createdAt: data.createdAt.toUTCString(),
  };
}
