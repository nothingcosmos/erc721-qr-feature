
## initial deploy

firebase consoleからプロジェクト作成(erc721-xxx)
firebase consoleのdatabaseからfirestoreを選択しデータベース作成
```
$ firebase use erc721-xxx
$ npm run predeploy
$ firebase deploy
```

各oauth providerにcallback url設定

## serviceName

public/index.html
stores/ethereum.js
stores/index.js


## pitfall

### OK
render = () => ();
render() {return ();}

### NG
render = () => {return ();}
