import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { keccak256, toUtf8Bytes } from "ethers";

const AMOUNT = 1000n * 10n ** 6n; // 1,000 AEDx (6 decimals)
const DOC_HASH = keccak256(toUtf8Bytes("Bill of Lading.pdf"));

async function deploy() {
  const [importer, exporter, other] = await ethers.getSigners();

  const AEDx = await ethers.getContractFactory("AEDx");
  const token = await AEDx.deploy();
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  // Give the importer funds and pre-approve the escrow.
  await token.mint(importer.address, AMOUNT * 10n);
  await token.connect(importer).approve(await escrow.getAddress(), AMOUNT * 10n);

  const deadline = BigInt((await time.latest()) + 7 * 24 * 3600);
  return { importer, exporter, other, token, escrow, deadline };
}

describe("Escrow", () => {
  it("runs the happy path: create → fund → submit matching doc → auto-release", async () => {
    const { importer, exporter, token, escrow, deadline } = await deploy();

    await expect(
      escrow
        .connect(importer)
        .createTrade(exporter.address, await token.getAddress(), AMOUNT, DOC_HASH, deadline)
    )
      .to.emit(escrow, "TradeCreated")
      .withArgs(0, importer.address, exporter.address, await token.getAddress(), AMOUNT, DOC_HASH, deadline);

    await expect(escrow.connect(importer).fund(0))
      .to.emit(escrow, "TradeFunded")
      .withArgs(0, AMOUNT);
    expect((await escrow.getTrade(0)).state).to.equal(1); // Funded

    // Matching doc hash auto-releases to the exporter in the same tx.
    await expect(escrow.connect(exporter).submitDoc(0, DOC_HASH))
      .to.emit(escrow, "DocSubmitted")
      .and.to.emit(escrow, "TradeReleased")
      .withArgs(0, exporter.address, AMOUNT);

    expect((await escrow.getTrade(0)).state).to.equal(3); // Released
    expect(await token.balanceOf(exporter.address)).to.equal(AMOUNT);
  });

  it("importer-confirms mode: release only by importer after a non-matching submit", async () => {
    const { importer, exporter, other, token, escrow, deadline } = await deploy();

    // requiredDocHash = 0x0 → importer-confirms mode.
    await escrow
      .connect(importer)
      .createTrade(exporter.address, await token.getAddress(), AMOUNT, ethers.ZeroHash, deadline);
    await escrow.connect(importer).fund(0);
    await escrow.connect(exporter).submitDoc(0, keccak256(toUtf8Bytes("whatever")));
    expect((await escrow.getTrade(0)).state).to.equal(2); // Shipped, not auto-released

    // A third party cannot release.
    await expect(escrow.connect(other).release(0)).to.be.revertedWithCustomError(
      escrow,
      "ConditionNotMet"
    );

    await expect(escrow.connect(importer).release(0))
      .to.emit(escrow, "TradeReleased")
      .withArgs(0, exporter.address, AMOUNT);
    expect(await token.balanceOf(exporter.address)).to.equal(AMOUNT);
  });

  it("refunds the importer after the deadline on an unshipped escrow", async () => {
    const { importer, exporter, token, escrow, deadline } = await deploy();
    await escrow
      .connect(importer)
      .createTrade(exporter.address, await token.getAddress(), AMOUNT, DOC_HASH, deadline);
    await escrow.connect(importer).fund(0);

    await expect(escrow.connect(importer).refund(0)).to.be.revertedWithCustomError(
      escrow,
      "DeadlineNotReached"
    );

    await time.increaseTo(deadline + 1n);
    const before = await token.balanceOf(importer.address);
    await expect(escrow.connect(importer).refund(0))
      .to.emit(escrow, "TradeRefunded")
      .withArgs(0, importer.address, AMOUNT);
    expect(await token.balanceOf(importer.address)).to.equal(before + AMOUNT);
    expect((await escrow.getTrade(0)).state).to.equal(4); // Refunded
  });

  it("supports dispute → refund unwind on a shipped escrow", async () => {
    const { importer, exporter, token, escrow, deadline } = await deploy();
    await escrow
      .connect(importer)
      .createTrade(exporter.address, await token.getAddress(), AMOUNT, ethers.ZeroHash, deadline);
    await escrow.connect(importer).fund(0);
    await escrow.connect(exporter).submitDoc(0, keccak256(toUtf8Bytes("suspect")));

    await expect(escrow.connect(importer).dispute(0)).to.emit(escrow, "TradeDisputed").withArgs(0);
    expect((await escrow.getTrade(0)).state).to.equal(5); // Disputed

    await expect(escrow.connect(importer).refund(0))
      .to.emit(escrow, "TradeRefunded")
      .withArgs(0, importer.address, AMOUNT);
  });

  it("enforces only-party access control and valid state", async () => {
    const { importer, exporter, other, token, escrow, deadline } = await deploy();
    await escrow
      .connect(importer)
      .createTrade(exporter.address, await token.getAddress(), AMOUNT, DOC_HASH, deadline);

    await expect(escrow.connect(other).fund(0)).to.be.revertedWithCustomError(escrow, "NotImporter");
    await escrow.connect(importer).fund(0);
    await expect(escrow.connect(importer).submitDoc(0, DOC_HASH)).to.be.revertedWithCustomError(
      escrow,
      "NotExporter"
    );
    // Cannot fund twice.
    await expect(escrow.connect(importer).fund(0)).to.be.revertedWithCustomError(
      escrow,
      "InvalidState"
    );
  });

  it("validates createTrade inputs", async () => {
    const { importer, exporter, token, escrow, deadline } = await deploy();
    const tokenAddr = await token.getAddress();
    await expect(
      escrow.connect(importer).createTrade(ethers.ZeroAddress, tokenAddr, AMOUNT, DOC_HASH, deadline)
    ).to.be.revertedWithCustomError(escrow, "ZeroAddress");
    await expect(
      escrow.connect(importer).createTrade(exporter.address, tokenAddr, 0, DOC_HASH, deadline)
    ).to.be.revertedWithCustomError(escrow, "ZeroAmount");
    await expect(
      escrow.connect(importer).createTrade(exporter.address, tokenAddr, AMOUNT, DOC_HASH, 1)
    ).to.be.revertedWithCustomError(escrow, "DeadlineInPast");
  });
});
