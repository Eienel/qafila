// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Qafila Escrow — smart-contract letter of credit (scaffold stub).
/// @notice Full lifecycle logic (Created → Funded → Shipped → Released,
///         plus Refunded/Disputed) lands in milestone 2. This stub compiles
///         and fixes the public shape so the frontend scaffold can build.
contract Escrow {
    enum State { Created, Funded, Shipped, Released, Refunded, Disputed }

    struct Trade {
        address importer;
        address exporter;
        address token;
        uint256 amount;
        bytes32 requiredDocHash;
        bytes32 submittedDocHash;
        uint64 deadline;
        State state;
    }

    uint256 public tradeCount;
    mapping(uint256 => Trade) public trades;

    event TradeCreated(uint256 indexed tradeId, address indexed importer, address indexed exporter);
}
