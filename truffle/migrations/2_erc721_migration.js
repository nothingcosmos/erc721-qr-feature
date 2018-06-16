/* global artifacts */
const Contract = artifacts.require('ERC721QR');
const fs = require('mz/fs');

module.exports = deployer => {
  deployer
    .deploy(Contract, 'ERC721QR', 'QR')
    .then(() =>
      Promise.all([
        fs.writeFile('../src/contracts/address.txt', Contract.address),
        fs.writeFile('../src/contracts/abi.json', JSON.stringify(Contract.toJSON().abi)),
      ])
    );
};
