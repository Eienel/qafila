"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";
import { http } from "wagmi";

// WalletConnect project id — set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.
// A placeholder keeps the app buildable; injected wallets (MetaMask) still work.
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "qafila-demo-placeholder";

export const config = getDefaultConfig({
  appName: "Qafila",
  projectId,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  },
  ssr: true,
});
