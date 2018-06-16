pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ERC721QR is ERC721Token {
    constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {}
    
    function mint(string _uri) external {
        // keccak256 is the cheapest.
        // https://ethereum.stackexchange.com/q/3184
        uint256 tokenId = keccak256(_uri);
        super._mint(msg.sender, tokenId);
        super._setTokenURI(tokenId, _uri);
    }
    
    function burn(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
        super._burn(msg.sender, _tokenId);
    }
}
