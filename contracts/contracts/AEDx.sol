// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title AEDx — mock AED-pegged stablecoin for the Qafila demo (Amoy testnet only).
/// @notice Not a real stablecoin. Freely mintable for demo purposes.
contract AEDx is ERC20 {
    uint8 private constant _DECIMALS = 6;

    constructor() ERC20("AED Stablecoin (Demo)", "AEDx") {
        // Seed the deployer with 1,000,000 AEDx for seeding demo escrows.
        _mint(msg.sender, 1_000_000 * 10 ** _DECIMALS);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /// @notice Open faucet so any demo wallet can grab test funds.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
