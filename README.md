```
$ npm i -g truffle ganache-cli
$ ganache-cli -d
$ ./start.sh
```

## mobx pitfall

### OK
render = () => ();
render() {return ();}

### NG
render = () => {return ();}
