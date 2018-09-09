pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership//Ownable.sol";

contract ApprovalERC721QR is ERC721Token, Ownable {
    constructor(string _name, string _symbol) public
      ERC721Token(_name, _symbol) {}
    
    function mint(address owner, uint256 _tokenId) external onlyOwner {
        super._mint(owner, _tokenId);
    }

    function setTokenURI(uint256 _tokenId, string _uri)
    external onlyOwnerOf(_tokenId) {
        require(exists(_tokenId));
        require(bytes(tokenURIs[_tokenId]).length == 0);
        super._setTokenURI(_tokenId, _uri);
    }
    
    function burn(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
        super._burn(msg.sender, _tokenId);
    }
}
