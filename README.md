```
$ npm i -g truffle ganache-cli
$ ganache-cli -d
$ ./start.sh
```

## initial deploy
firebase consoleからプロジェクト作成(erc721-xxx)
firebase consoleのdatabaseからfirestoreを選択しデータベース作成
$ firebase use erc721-xxx
$ npm run predeploy
$ firebase deploy

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
