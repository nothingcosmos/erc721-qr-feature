/* global artifacts */
const Contract = artifacts.require('ApprovalERC721QR');
const fs = require('mz/fs');

module.exports = deployer => {
  deployer
    .deploy(Contract, 'ApprovalERC721QR', 'ApprovalQR')
    .then(() =>
      Promise.all([
        fs.writeFile('../src/contracts/approval_address.txt', Contract.address),
        fs.writeFile('../src/contracts/approval_abi.json', JSON.stringify(Contract.toJSON().abi)),
      ])
    );
};
