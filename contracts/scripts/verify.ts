import { run, network } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";

// Verifies the already-deployed AEDx + Escrow on Polygonscan (Amoy). Reads the
// live addresses from web/src/contracts/addresses.json. Both contracts have
// no constructor arguments.
//   POLYGONSCAN_API_KEY=... npx hardhat run scripts/verify.ts --network amoy
async function main() {
  const addrPath = join(__dirname, "../../web/src/contracts/addresses.json");
  const { escrow, aedx } = JSON.parse(readFileSync(addrPath, "utf8"));
  if (/^0x0{40}$/.test(escrow)) throw new Error("No deployed addresses to verify.");

  console.log(`Verifying on ${network.name}: AEDx=${aedx} Escrow=${escrow}`);
  for (const address of [aedx, escrow]) {
    try {
      await run("verify:verify", { address, constructorArguments: [] });
      console.log(`Verified ${address}`);
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (/already verified/i.test(msg)) console.log(`Already verified ${address}`);
      else console.error(`Verify failed for ${address}: ${msg}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
