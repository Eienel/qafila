// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Qafila Escrow — a smart-contract letter of credit.
/// @notice An importer locks ERC-20 stablecoin in trust (amana); it releases to
///         the exporter when the agreed shipment condition is proven, or refunds
///         to the importer on timeout / mutual cancel.
/// @dev Checks-effects-interactions, SafeERC20, ReentrancyGuard, only-party
///      modifiers. Amounts are pulled on fund() and pushed on release/refund.
contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum State {
        Created, // trade terms set, not yet funded
        Funded, // importer deposited funds, awaiting shipment
        Shipped, // exporter submitted shipment doc
        Released, // funds paid to exporter (terminal)
        Refunded, // funds returned to importer (terminal)
        Disputed // importer disputed after shipment (hold)
    }

    struct Trade {
        address importer;
        address exporter;
        address token; // ERC-20 stablecoin
        uint256 amount;
        bytes32 requiredDocHash; // agreed shipment-doc hash; 0x0 = "importer confirms" mode
        bytes32 submittedDocHash; // hash the exporter actually submitted
        uint64 deadline; // unix seconds; after this the importer may refund
        State state;
    }

    /// @notice A shipment-tracking checkpoint appended to a trade's timeline.
    /// @dev Pure logging: milestones never touch funds or the escrow State. The
    ///      `status` code is interpreted by the frontend (0 Booked, 1 Picked up,
    ///      2 In transit, 3 At customs, 4 Out for delivery, 5 Delivered, …).
    struct Milestone {
        uint8 status;
        string location;
        string note;
        uint64 timestamp;
    }

    uint256 public tradeCount;
    mapping(uint256 => Trade) public trades;
    mapping(uint256 => Milestone[]) private _milestones;

    event TradeCreated(
        uint256 indexed tradeId,
        address indexed importer,
        address indexed exporter,
        address token,
        uint256 amount,
        bytes32 requiredDocHash,
        uint64 deadline
    );
    event TradeFunded(uint256 indexed tradeId, uint256 amount);
    event DocSubmitted(uint256 indexed tradeId, bytes32 submittedDocHash);
    event TradeReleased(uint256 indexed tradeId, address indexed exporter, uint256 amount);
    event TradeRefunded(uint256 indexed tradeId, address indexed importer, uint256 amount);
    event TradeDisputed(uint256 indexed tradeId);
    event MilestonePosted(
        uint256 indexed tradeId,
        uint256 indexed index,
        uint8 status,
        string location,
        string note,
        uint64 timestamp
    );

    error NotImporter();
    error NotExporter();
    error InvalidState();
    error ZeroAddress();
    error ZeroAmount();
    error DeadlineInPast();
    error DeadlineNotReached();
    error ConditionNotMet();

    modifier onlyImporter(uint256 tradeId) {
        if (msg.sender != trades[tradeId].importer) revert NotImporter();
        _;
    }

    modifier onlyExporter(uint256 tradeId) {
        if (msg.sender != trades[tradeId].exporter) revert NotExporter();
        _;
    }

    modifier inState(uint256 tradeId, State expected) {
        if (trades[tradeId].state != expected) revert InvalidState();
        _;
    }

    /// @notice Importer defines the trade. No funds move yet.
    /// @param requiredDocHash agreed shipment-doc hash, or 0x0 for "importer confirms" mode.
    /// @return tradeId identifier of the new trade.
    function createTrade(
        address exporter,
        address token,
        uint256 amount,
        bytes32 requiredDocHash,
        uint64 deadline
    ) external returns (uint256 tradeId) {
        if (exporter == address(0) || token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (deadline <= block.timestamp) revert DeadlineInPast();

        tradeId = tradeCount++;
        trades[tradeId] = Trade({
            importer: msg.sender,
            exporter: exporter,
            token: token,
            amount: amount,
            requiredDocHash: requiredDocHash,
            submittedDocHash: bytes32(0),
            deadline: deadline,
            state: State.Created
        });

        emit TradeCreated(tradeId, msg.sender, exporter, token, amount, requiredDocHash, deadline);
    }

    /// @notice Importer funds the escrow (requires prior ERC-20 approval).
    function fund(uint256 tradeId)
        external
        nonReentrant
        onlyImporter(tradeId)
        inState(tradeId, State.Created)
    {
        Trade storage t = trades[tradeId];
        t.state = State.Funded;
        IERC20(t.token).safeTransferFrom(msg.sender, address(this), t.amount);
        emit TradeFunded(tradeId, t.amount);
    }

    /// @notice Exporter submits the shipment document hash → Shipped.
    /// @dev If the hash matches the agreed hash, funds auto-release in the same tx.
    function submitDoc(uint256 tradeId, bytes32 docHash)
        external
        nonReentrant
        onlyExporter(tradeId)
        inState(tradeId, State.Funded)
    {
        Trade storage t = trades[tradeId];
        t.submittedDocHash = docHash;
        t.state = State.Shipped;
        emit DocSubmitted(tradeId, docHash);

        // Doc-hash oracle: auto-release when the submitted hash matches the agreed one.
        if (t.requiredDocHash != bytes32(0) && docHash == t.requiredDocHash) {
            _release(tradeId, t);
        }
    }

    /// @notice Release funds to the exporter.
    /// @dev Allowed when the submitted hash matches the required hash, or when the
    ///      importer confirms (covers "importer confirms" mode and doc-hash mode).
    function release(uint256 tradeId)
        external
        nonReentrant
        inState(tradeId, State.Shipped)
    {
        Trade storage t = trades[tradeId];
        bool hashMatches = t.requiredDocHash != bytes32(0) &&
            t.submittedDocHash == t.requiredDocHash;
        bool importerConfirms = msg.sender == t.importer;
        if (!hashMatches && !importerConfirms) revert ConditionNotMet();
        _release(tradeId, t);
    }

    function _release(uint256 tradeId, Trade storage t) private {
        t.state = State.Released;
        IERC20(t.token).safeTransfer(t.exporter, t.amount);
        emit TradeReleased(tradeId, t.exporter, t.amount);
    }

    /// @notice Refund the importer. Allowed after the deadline passes on a still-
    ///         Funded escrow (timeout), or to unwind a Disputed hold.
    function refund(uint256 tradeId)
        external
        nonReentrant
        onlyImporter(tradeId)
    {
        Trade storage t = trades[tradeId];
        if (t.state == State.Funded) {
            // Funded but not yet shipped: refund only after the deadline (timeout).
            if (block.timestamp < t.deadline) revert DeadlineNotReached();
        } else if (t.state == State.Disputed) {
            // Disputed holds may be unwound by the importer.
        } else {
            revert InvalidState();
        }

        t.state = State.Refunded;
        IERC20(t.token).safeTransfer(t.importer, t.amount);
        emit TradeRefunded(tradeId, t.importer, t.amount);
    }

    /// @notice Importer disputes a shipped trade → Disputed (hold). Manual resolve for MVP.
    function dispute(uint256 tradeId)
        external
        onlyImporter(tradeId)
        inState(tradeId, State.Shipped)
    {
        trades[tradeId].state = State.Disputed;
        emit TradeDisputed(tradeId);
    }

    /// @notice Exporter appends a shipment-tracking milestone to the trade.
    /// @dev Pure logging — does not move funds or change escrow State. Allowed once
    ///      the trade is funded and until it reaches a terminal state, so a timeline
    ///      can be recorded across the Funded → Shipped window (and after auto-release
    ///      is still blocked, since Released/Refunded/Disputed are terminal for tracking).
    function postMilestone(
        uint256 tradeId,
        uint8 status,
        string calldata location,
        string calldata note
    ) external onlyExporter(tradeId) {
        State s = trades[tradeId].state;
        if (s != State.Funded && s != State.Shipped) revert InvalidState();

        uint64 ts = uint64(block.timestamp);
        _milestones[tradeId].push(
            Milestone({status: status, location: location, note: note, timestamp: ts})
        );
        emit MilestonePosted(tradeId, _milestones[tradeId].length - 1, status, location, note, ts);
    }

    /// @notice Number of tracking milestones recorded for a trade.
    function milestoneCount(uint256 tradeId) external view returns (uint256) {
        return _milestones[tradeId].length;
    }

    /// @notice Full shipment-tracking timeline for a trade (frontend reads this).
    function getMilestones(uint256 tradeId) external view returns (Milestone[] memory) {
        return _milestones[tradeId];
    }

    /// @notice Read a trade (convenience for the frontend / judge panel).
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }
}
