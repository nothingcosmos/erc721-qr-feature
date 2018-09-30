pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/payment/ConditionalEscrow.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";

contract QREscrow is ConditionalEscrow{
  using SafeMath for uint256;
  using Address for address;

  uint256 private _lower; //eth
  uint256 private _deadline; //UTC
  address private _payer;
  address private _beneficiary;
  bool private _withdrawalAllowed;

  constructor(uint256 lower, uint256 deadline, address payer, address beneficiary) public {
    _lower = lower;
    _deadline = deadline;
    _payer = payer;
    _beneficiary = beneficiary;
    _withdrawalAllowed = false;
  }

  function deposit() public payable {
    require(_payer == msg.sender);
    require(_lower <= msg.value);
    require(block.timestamp >= _deadline);
    super.deposit(msg.sender);
  }

  function deposited() public view returns (bool) {
    return (address(this).balance >= _lower);
  }

  function payer() public view returns(address) {
    return _payer;
  }

  function deadline() public view returns(uint256) {
    return _deadline;
  }

  function price() public view returns(uint256) {
    return _lower;
  }

  function close() public onlyPrimary {
    _withdrawalAllowed = true;
  }

  //override
  function withdrawalAllowed(address payee) public view returns (bool) {
    require(payee == _beneficiary);
    return _withdrawalAllowed;
  }
}

contract ERC721QREscrow is ERC721Full, Ownable {
  using SafeMath for uint256;
  using Address for address;

  // mapping from tokenId to Escrow
  mapping (uint256 => QREscrow) internal _escrows;

  event CreateEscrow(
      address indexed owner,
      address indexed payer,
      address escrow,
      uint256 indexed tokenId
  );

  event TransferEscrowPayer(
      address indexed owner,
      address indexed payer,
      address escrow,
      uint256 indexed tokenId
  );

  constructor(string _name, string _symbol) public
    ERC721Full(_name, _symbol) {}
    
  //Reverts if the given tokenId already exists in supermethod
  function mint(uint256 tokenId, string metadata) external {
    // keccak256 is the cheapest.
    // https://ethereum.stackexchange.com/q/3184
    super._mint(msg.sender, tokenId);
    super._setTokenURI(tokenId, metadata);
  }

  function burn(uint256 tokenId) external {
    require(ownerOf(tokenId) == msg.sender);
    super._burn(msg.sender, tokenId);
  }

  function createEscrow(uint256 tokenId, uint256 lower,
    uint256 deadline, address payer) public returns (address)
  {
    require(ownerOf(tokenId) == msg.sender);

    require(_escrows[tokenId] == address(0));
    QREscrow e = new QREscrow(lower, deadline, payer, msg.sender);
    _escrows[tokenId] = e;

    emit TransferEscrowPayer(msg.sender, payer, address(e), tokenId);
    return address(e);
  }

  function escrowAddress(uint256 tokenId)
    public view returns (address)
  {
    return (address(_escrows[tokenId]));
  }

  function escrowPrice(uint256 tokenId)
    public view returns (uint256)
  {
    require(_escrows[tokenId] != address(0));
    QREscrow e = _escrows[tokenId];
    return e.price();
  }


  function resetEscrow(uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender);
    require(_escrows[tokenId] != address(0));
    QREscrow e = _escrows[tokenId];
    require(e.deposited() == false);
    require(block.timestamp >= e.deadline());

    delete(_escrows[tokenId]);
  }

  //_tokenApprovalsがinternalからprivateに変わったため、
  //承認する必要がある。
  function approveForEscrow(uint256 tokenId) public
  {
    require(ownerOf(tokenId) == msg.sender);
    QREscrow e = _escrows[tokenId];
    require(e.deposited());
    super.approve(e.payer(), tokenId);
  }

  function isApprovedForEscrow(uint256 tokenId)
  public view returns(bool)
  {
    require(_escrows[tokenId] != address(0));
    QREscrow e = _escrows[tokenId];

    address a = super.getApproved(tokenId);
    return a == e.payer();
  }

  function transferEscrowPayer(uint256 tokenId, string meta) public
  {
    require(_escrows[tokenId] != address(0));
    QREscrow e = _escrows[tokenId];
    require(e.deposited());
    require(e.payer() == msg.sender);

    address owner = ownerOf(tokenId);
    //clear tokenApprovals
    super.safeTransferFrom(owner, msg.sender, tokenId);
    super._setTokenURI(tokenId, meta);
    e.close();

    emit TransferEscrowPayer(owner, msg.sender, address(e), tokenId);
    delete(_escrows[tokenId]);
  }
}
