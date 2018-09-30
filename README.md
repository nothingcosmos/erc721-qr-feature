
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

# AppName

public/index.html title
stores/ethereum originalTag
stores/index serviceName
stores/RouteStore apiEndpoint/hostingEndpoint

### local library

cloudsign swagger hub

https://app.swaggerhub.com/apis/CloudSign/cloudsign-web_api/0.7.3

javascript codegen

unzip xxx cloudsign_api
cd cloudsign_api
vi package.json // _web_api -> cloudsign_api
npm install
sudo npm link

cd erc721_qr_feature
npm link cloudsign_api

