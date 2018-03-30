pragma solidity ^0.4.21;

import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ERC721QR is ERC721Token {
    function ERC721QR(string _name, string _symbol) public ERC721Token(_name, _symbol) {}
    
    function mint(address _to, uint256 _tokenId, string _uri) external {
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _uri);
    }
    
    function burn(address _owner, uint256 _tokenId) external {
        super._burn(_owner, _tokenId);
    }
}
