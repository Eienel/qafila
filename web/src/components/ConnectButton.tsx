"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

// Thin wrapper so pages import a stable component; RainbowKit handles the modal,
// chain switching, and the Amoy network shown to demo judges.
export function WalletConnect() {
  return <ConnectButton showBalance={false} chainStatus="icon" />;
}
