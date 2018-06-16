var Contract = artifacts.require("ERC721QR");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Contract, "ERC721QR", "QR");
};