/* global artifacts */
const Contract = artifacts.require('ERC721QR');
const fs = require('mz/fs');

module.exports = deployer => {
  deployer.then(async () => {
    await deployer.deploy(Contract, 'ERC721QR', 'QR');
    //console.log(JSON.stringify({"contractAddress":Contract.address}));
    //console.log(JSON.stringify(Contract.toJSON().abi));
    Promise.all([
      fs.writeFile('../src/contracts/address.json', JSON.stringify({"contractAddress":Contract.address})),
      fs.writeFile('../src/contracts/abi.json', JSON.stringify(Contract.toJSON().abi)),
    ])
  });
};
