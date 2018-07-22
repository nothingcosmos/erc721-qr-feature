pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ERC721QR is ERC721Token {
    constructor(string _name, string _symbol) public
      ERC721Token(_name, _symbol) {}
    
    //Reverts if the given tokenId already exists in supermethod.
    function mint(uint256 _tokenId, string _metadata) external {
        // keccak256 is the cheapest.
        // https://ethereum.stackexchange.com/q/3184
        super._mint(msg.sender, _tokenId);
        super._setTokenURI(_tokenId, _metadata);
    }
    
    function burn(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
        super._burn(msg.sender, _tokenId);
    }
}
