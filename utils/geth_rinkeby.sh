#!/bin/bash

which geth || exit "not found geth"

#geth --rinkeby --cache=2048 --rpc --rpcapi db,net,web3,eth,personal
geth --rinkeby --rpc --rpcapi db,net,web3,eth,personal

