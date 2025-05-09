// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, WORK_SUBMITTED, COMPLETE, REFUNDED, IN_DISPUTE }
    
    address public client;
    address public freelancer;
    uint256 public amount;
    uint public submissionDeadline;
    State public state;
    IERC20 public usdc;
    string public file;
    bytes32 public fileHash;

    address[] public arbitrators;
    mapping(address => bool) public isArbitrator;
    mapping(address => bool) public hasVoted;
    uint public votesInFavor;
    uint public votesAgainst;
    uint public totalVotes;

    event WorkSubmitted(string fileUrl);
    event PaymentReleased();
    event DisputeRaised();
    event EscrowFunded(uint256 amount);
    // event DisputeResolved(bool inFavorOfFreelancer);

    constructor(
        address _client,
        address _freelancer,
        uint256 _amount,
        uint _submissionPeriodInDays,
        address _usdc,
        address[] memory _arbitrators
    ) {
        // require(_arbitrators.length == 10, "Exactly 10 arbitrators required");
        client = _client;
        freelancer = _freelancer;
        amount = _amount;
        submissionDeadline = block.timestamp + (_submissionPeriodInDays * 1 days);
        state = State.AWAITING_PAYMENT;
        usdc = IERC20(_usdc);

        for (uint i = 0; i < _arbitrators.length; i++) {
            arbitrators.push(_arbitrators[i]);
            isArbitrator[_arbitrators[i]] = true;
        }
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client can perform this action");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier onlyArbitrator() {
        require(isArbitrator[msg.sender], "Only arbitrators can perform this action");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }

    function fundEscrow() external onlyClient inState(State.AWAITING_PAYMENT) {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        state = State.AWAITING_DELIVERY;
        emit EscrowFunded(amount);
    }

    function submitWork(string memory _fileUrl) external onlyFreelancer inState(State.AWAITING_DELIVERY) {
        require(block.timestamp <= submissionDeadline, "Submission deadline passed.");
        file = _fileUrl;
        fileHash = sha256(abi.encodePacked(_fileUrl));
        state = State.WORK_SUBMITTED;
        emit WorkSubmitted(_fileUrl);
    }

    function releasePayment() external onlyClient inState(State.WORK_SUBMITTED) {
        usdc.transfer(freelancer, amount);
        state = State.COMPLETE;
        emit PaymentReleased();
    }

    function raiseDispute() external onlyClient inState(State.WORK_SUBMITTED) {
        state = State.IN_DISPUTE;
        votesInFavor = 0;
        votesAgainst = 0;
        totalVotes = 0;

        emit DisputeRaised();
    }

    function vote(bool inFavor) external onlyArbitrator inState(State.IN_DISPUTE) {
        require(!hasVoted[msg.sender], "Arbitrator has already voted");
        hasVoted[msg.sender] = true;
        totalVotes++;

        if (inFavor) {
            votesInFavor++;
        } else {
            votesAgainst++;
        }

        if (totalVotes == 3) {
            resolveDispute();
        }
    }

    function resolveDispute() internal {
        if (votesInFavor > votesAgainst) {
            usdc.transfer(client, amount);
            state = State.REFUNDED;
            // emit DisputeResolved(true);
        } else {
            usdc.transfer(freelancer, amount);
            state = State.COMPLETE;
            // emit DisputeResolved(false);
        }

        // Reset voting state
        for (uint i = 0; i < arbitrators.length; i++) {
            hasVoted[arbitrators[i]] = false;
        }
    }

    function getEscrowState() external view returns (string memory) {
        if (state == State.AWAITING_PAYMENT) return "AWAITING_PAYMENT";
        if (state == State.AWAITING_DELIVERY) return "AWAITING_DELIVERY";
        if (state == State.WORK_SUBMITTED) return "WORK_SUBMITTED";
        if (state == State.COMPLETE) return "COMPLETE";
        if (state == State.REFUNDED) return "REFUNDED";
        if (state == State.IN_DISPUTE) return "IN_DISPUTE";
        return "UNKNOWN";
    }
}