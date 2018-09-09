pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/payment/ConditionalEscrow.sol";

contract ERC721QREscrow is ERC721Full, ERC721Mintable, ConditionalEscrow, Ownable {
    constructor(string _name, string _symbol) public
      ERC721Full(_name, _symbol) {}
    
    //Reverts if the given tokenId already exists in supermethod.
    function mint(uint256 _tokenId, string _metadata) external {
        // keccak256 is the cheapest.
        // https://ethereum.stackexchange.com/q/3184
        super._mint(msg.sender, _tokenId);
        super._setTokenURI(_tokenId, _metadata);
    }
    
    //todo burn
}
