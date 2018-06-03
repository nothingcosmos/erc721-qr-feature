pragma solidity ^0.4.23;

import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ERC721QR is ERC721Token {
    function ERC721QR() public ERC721Token("ERC721QR", "QR") {}
    
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
