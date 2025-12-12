// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PayToPlay {
    address public owner;
    uint256 public entryFeeWei; // set 0 to require only a tx (gas only)

    mapping(address => bool) public hasEntered;

    event Entered(address indexed player, uint256 paid);

    constructor(uint256 _entryFeeWei) {
        owner = msg.sender;
        entryFeeWei = _entryFeeWei;
    }

    function enter() external payable {
        require(!hasEntered[msg.sender], "Already entered");
        require(msg.value >= entryFeeWei, "Entry fee too low");

        hasEntered[msg.sender] = true;
        emit Entered(msg.sender, msg.value);
    }

    function withdraw(address payable to) external {
        require(msg.sender == owner, "Not owner");
        to.transfer(address(this).balance);
    }

    function setEntryFee(uint256 _entryFeeWei) external {
        require(msg.sender == owner, "Not owner");
        entryFeeWei = _entryFeeWei;
    }
}
