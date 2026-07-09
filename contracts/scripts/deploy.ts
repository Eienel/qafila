import { ethers, network } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Deploys AEDx (mock stablecoin) + Escrow, then writes addresses + ABIs to
// ../web/src/contracts so the frontend can import them directly.
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying on ${network.name} from ${deployer.address}`);

  const AEDx = await ethers.getContractFactory("AEDx");
  const aedx = await AEDx.deploy();
  await aedx.waitForDeployment();
  const aedxAddr = await aedx.getAddress();
  console.log(`AEDx:   ${aedxAddr}`);

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log(`Escrow: ${escrowAddr}`);

  const escrowArtifact = await import("../artifacts/contracts/Escrow.sol/Escrow.json");
  const aedxArtifact = await import("../artifacts/contracts/AEDx.sol/AEDx.json");

  const outDir = join(__dirname, "../../web/src/contracts");
  mkdirSync(outDir, { recursive: true });

  writeFileSync(
    join(outDir, "addresses.json"),
    JSON.stringify(
      { chainId: network.config.chainId, escrow: escrowAddr, aedx: aedxAddr },
      null,
      2
    )
  );
  writeFileSync(join(outDir, "Escrow.abi.json"), JSON.stringify(escrowArtifact.abi, null, 2));
  writeFileSync(join(outDir, "AEDx.abi.json"), JSON.stringify(aedxArtifact.abi, null, 2));

  console.log(`Wrote addresses + ABIs to ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
