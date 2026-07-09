import { ethers, network } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";

// Seeds 1–2 demo escrows so judges land on a populated dashboard.
// Run AFTER deploy.ts. The deployer acts as the importer.
//
//   EXPORTER_ADDRESS=0x... npx hardhat run scripts/seed.ts --network amoy
//
// Reads deployed addresses from web/src/contracts/addresses.json.
async function main() {
  const addrPath = join(__dirname, "../../web/src/contracts/addresses.json");
  const { escrow: escrowAddr, aedx: aedxAddr } = JSON.parse(readFileSync(addrPath, "utf8"));
  if (/^0x0{40}$/.test(escrowAddr)) throw new Error("Deploy first: addresses are placeholders.");

  const [importer] = await ethers.getSigners();
  const exporter =
    process.env.EXPORTER_ADDRESS ||
    // A deterministic demo exporter if none supplied (won't be able to submit,
    // but shows a populated dashboard). Prefer passing a real second wallet.
    "0x000000000000000000000000000000000000dEaD";

  console.log(`Seeding on ${network.name}: importer=${importer.address} exporter=${exporter}`);

  const escrow = await ethers.getContractAt("Escrow", escrowAddr);
  const aedx = await ethers.getContractAt("AEDx", aedxAddr);
  const decimals = await aedx.decimals();
  const unit = 10n ** BigInt(decimals);

  // Fund the importer's demo balance.
  await (await aedx.mint(importer.address, 50_000n * unit)).wait();

  const weekOut = BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 3600);
  const docHash = keccak256(toUtf8Bytes("Bill of Lading.pdf"));

  // Escrow #0 — doc-hash mode, funded and waiting for the exporter's document.
  const amount0 = 12_000n * unit;
  await (await escrow.createTrade(exporter, aedxAddr, amount0, docHash, weekOut)).wait();
  await (await aedx.approve(escrowAddr, amount0)).wait();
  await (await escrow.fund(0)).wait();
  console.log("Seeded escrow #0 — Funded (doc-hash mode). Agreed hash:", docHash);

  // Escrow #1 — importer-confirms mode, created (not yet funded).
  const amount1 = 3_500n * unit;
  await (await escrow.createTrade(exporter, aedxAddr, amount1, ethers.ZeroHash, weekOut)).wait();
  console.log("Seeded escrow #1 — Created (importer-confirms mode).");

  console.log("Done. Open the dashboard as the importer wallet.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
