# geth command line

## ubuntu16 setup

setup geth
`
$ sudo apt-get update //if error, sudo apt-get remove libappstream3
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum
`

run geth
`
$ geth --rinkeby --rpc --rpcapi db,net,web3,eth,personal
//database=~/.ethereum/rinkeby/geth/chaindata
$ geth --rinkeby attach
>  eth.syncing
false // falseで成功、そうでなければblockNumberを参照して最新まで取り込めたか
`

setup truffle
`
$ sudo apt-get install -y nodejs npm
$ sudo npm install n -g
$ sudo n stable //ubuntuではnodeが衝突

$ sudo npm install -g truffle
$ sudo npm install zeppelin-solidity
//or
$ sudo npm install -E zeppelin-solidity //@1.7.0 or 1.8.0 or ...
`

compile solidity
`
$ cd xxx && npm install
$ truffle compile
`

create account and unlock
`
> personal.newAccount()
> personal.unlockAccount(eth.coinbase)
phassphase:
`

rinkebyのfauctは
`
Requesting faucet funds into 0x777c60d07d552715993cf1cd5be612722fd12113 on the #Rinkeby #Ethereum test network.
`
をtweetしてそのURLを貼り付ける
https://faucet.rinkeby.io/

deploy contract
`
$ cat  truffle.js
  rinkeby: {
    host: "localhost", // Connect to geth on the specified
    port: 8545, //default rpc port
    from: "0xABCDE", // default address
    network_id: 4, //rinkeby id
    gas: 4700000 // Gas limit used for deploys
  },
$ truffle migrate --network rinkeby //or add --reset
`


