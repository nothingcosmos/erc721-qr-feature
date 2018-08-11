```
$ npm i -g truffle ganache-cli
$ ganache-cli -d
$ ./start.sh
```

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
