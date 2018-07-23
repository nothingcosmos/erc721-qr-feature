#!/bin/bash

# firestoreからrequests/tokensを削除
# Yes/Noで聞かれる
firebase firestore:delete --all-collections

# storageからimagesを削除 ...したいがコマンドがない
# consoleから手動で削除するか
