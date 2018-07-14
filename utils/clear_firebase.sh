#!/bin/bash

# firestoreからrequests/tokensを削除
firebase firestore:delete --all-collections

# storageからimagesを削除 ...したいがコマンドがない
# consoleから手動で削除するか
