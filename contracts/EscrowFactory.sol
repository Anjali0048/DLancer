// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Escrow.sol";

contract EscrowFactory {
    address[] public escrows;
    address public usdc;
    address[] public arbitrators;

    event EscrowCreated(address escrowAddress, address client, address freelancer, uint256 amount);

    constructor(address _usdc, address[] memory _arbitrators) {
        usdc = _usdc;
        arbitrators = _arbitrators;
    }

    function createEscrow(address freelancer, uint256 amount, uint _submissionPeriodInDays) external returns (address) {
        Escrow newEscrow = new Escrow(msg.sender, freelancer, amount, _submissionPeriodInDays, usdc, arbitrators);
        address escrowAddress = address(newEscrow);
        escrows.push(escrowAddress);

        emit EscrowCreated(escrowAddress, msg.sender, freelancer, amount);

        return escrowAddress;
    }

    function getAllEscrows() external view returns (address[] memory) {
        return escrows;
    }
}