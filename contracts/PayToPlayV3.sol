// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PayToPlayV3 {
    address public owner;
    uint256 public entryFeeWei;

    mapping(address => bool) public hasEntered;

    event Entered(address indexed player, uint256 paid);
    event Ping(address indexed player, uint256 timestamp);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(uint256 _entryFeeWei) {
        owner = msg.sender;
        entryFeeWei = _entryFeeWei;
    }

    receive() external payable {}

    function enter() external payable {
        require(!hasEntered[msg.sender], "Already entered");
        require(msg.value >= entryFeeWei, "Entry fee too low");
        hasEntered[msg.sender] = true;
        emit Entered(msg.sender, msg.value);
    }

    // Always requires a transaction; used to force a wallet popup on "New Game".
    function ping() external {
        emit Ping(msg.sender, block.timestamp);
    }

    function withdraw(address payable to) external {
        require(msg.sender == owner, "Not owner");
        uint256 amount = address(this).balance;
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Withdraw failed");
        emit Withdrawn(to, amount);
    }
}
