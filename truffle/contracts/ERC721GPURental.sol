pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ERC721GPURental is ERC721Token {
    constructor(string _name, string _symbol) public
      ERC721Token(_name, _symbol) {}

    mapping (uint256 => address) internal lendOwners;
    mapping (uint256 => uint256) internal lendDeadlines;
    event ApprovalForLendOwner(
      address indexed _owner,
      address indexed _approved,
      uint256 indexed _tokenId
    );
    
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

    modifier onlyLendOwnerOf(uint256 _tokenId) {
      require(lendOwnerOf(_tokenId) == msg.sender);
      _;
    }

    function lendOwnerOf(uint256 _tokenId) public view returns (address) {
        address lendOwner = lendOwners[_tokenId];
        require(lendOwner != address(0));
        return lendOwner;
    }

    function notLent(uint256 _tokenId) public view returns (bool) {
        address lendOwner = lendOwners[_tokenId];
        return (lendOwner == address(0));
    }

    function lend(uint256 _tokenId, uint256 deadline, address to)
        external onlyOwnerOf(_tokenId)
    {
        require(notLent(_tokenId));
        lendOwners[_tokenId] = msg.sender;
        lendDeadlines[_tokenId] = deadline;
        
        super.safeTransferFrom(msg.sender, to, _tokenId);
    }

    function deadline(uint256 _tokenId) public view returns (uint256)
    {
        require(!notLent(_tokenId));
        return lendDeadlines[_tokenId];
    }

    // required approved from tokenId owner
    function returnLendOwner(uint256 _tokenId) external
        onlyLendOwnerOf(_tokenId)
    {
        require(!notLent(_tokenId));
        require(block.timestamp >= deadline(_tokenId));

        if (ownerOf(_tokenId) == lendOwnerOf(_tokenId)) {
          lendOwners[_tokenId] = address(0);
          lendDeadlines[_tokenId] = 0;
          return;
        }

        //denger
        tokenApprovals[_tokenId] = msg.sender;
        emit ApprovalForLendOwner(ownerOf(_tokenId), msg.sender, _tokenId);
        
        super.safeTransferFrom(ownerOf(_tokenId), msg.sender, _tokenId);

        //cleanup
        lendOwners[_tokenId] = address(0);
        lendDeadlines[_tokenId] = 0;
    }
}
