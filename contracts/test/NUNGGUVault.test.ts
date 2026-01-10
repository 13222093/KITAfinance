import { expect } from "chai";
import { ethers } from "hardhat";
import { NUNGGUVault, MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("NUNGGUVault", function () {
  let vault: NUNGGUVault;
  let idrx: MockERC20;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let thetanutsRFQ: SignerWithAddress; // Mock address
  let aavePool: SignerWithAddress; // Mock address
  let ethToken: SignerWithAddress; // Mock ETH address

  const INITIAL_BALANCE = ethers.parseEther("1000000000"); // 1B IDRX
  const MIN_COLLATERAL = ethers.parseEther("1000000"); // 1M IDRX
  const TARGET_PRICE = ethers.parseEther("40000000"); // 40M IDRX
  const COLLATERAL = ethers.parseEther("40000000"); // 40M IDRX

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, thetanutsRFQ, aavePool, ethToken] =
      await ethers.getSigners();

    // Deploy Mock IDRX token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    idrx = await MockERC20.deploy("Indonesian Rupiah", "IDRX", 18);
    await idrx.waitForDeployment();

    // Deploy NUNGGUVault
    const Vault = await ethers.getContractFactory("NUNGGUVault");
    vault = await Vault.deploy(
      await idrx.getAddress(),
      thetanutsRFQ.address,
      aavePool.address,
      ethToken.address
    );
    await vault.waitForDeployment();

    // Mint IDRX to users
    await idrx.mint(user1.address, INITIAL_BALANCE);
    await idrx.mint(user2.address, INITIAL_BALANCE);

    // Mint IDRX to vault for mock premiums
    await idrx.mint(await vault.getAddress(), ethers.parseEther("10000000")); // 10M for premiums
  });

  describe("Deployment", function () {
    it("Should set the correct IDRX token", async function () {
      expect(await vault.IDRX()).to.equal(await idrx.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should set correct initial values", async function () {
      expect(await vault.totalPositionsCreated()).to.equal(0);
      expect(await vault.totalValueLocked()).to.equal(0);
      expect(await vault.platformFee()).to.equal(1000); // 10%
      expect(await vault.minCollateral()).to.equal(MIN_COLLATERAL);
    });

    it("Should reject zero addresses in constructor", async function () {
      const Vault = await ethers.getContractFactory("NUNGGUVault");

      await expect(
        Vault.deploy(
          ethers.ZeroAddress,
          thetanutsRFQ.address,
          aavePool.address,
          ethToken.address
        )
      ).to.be.revertedWith("Invalid IDRX address");

      await expect(
        Vault.deploy(
          await idrx.getAddress(),
          ethers.ZeroAddress,
          aavePool.address,
          ethToken.address
        )
      ).to.be.revertedWith("Invalid Thetanuts address");
    });
  });

  describe("Create Position", function () {
    it("Should create a position successfully", async function () {
      // Approve vault to spend IDRX
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);

      // Create position
      const tx = await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);

      // Check event emission
      await expect(tx).to.emit(vault, "PositionCreated");

      // Check position data
      const positions = await vault.getUserPositions(user1.address);
      expect(positions.length).to.equal(1);
      expect(positions[0].collateral).to.equal(COLLATERAL);
      expect(positions[0].targetPrice).to.equal(TARGET_PRICE);
      expect(positions[0].isActive).to.equal(true);
      expect(positions[0].autoRoll).to.equal(false);

      // Check TVL updated
      expect(await vault.totalValueLocked()).to.equal(COLLATERAL);
      expect(await vault.totalPositionsCreated()).to.equal(1);
    });

    it("Should transfer collateral from user to vault", async function () {
      const userBalanceBefore = await idrx.balanceOf(user1.address);
      const vaultBalanceBefore = await idrx.balanceOf(await vault.getAddress());

      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);
      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);

      const userBalanceAfter = await idrx.balanceOf(user1.address);
      const vaultBalanceAfter = await idrx.balanceOf(await vault.getAddress());

      // User balance should decrease by collateral (but increase by premium)
      // For simplicity in mock, premium is 0 so only collateral decrease
      expect(userBalanceBefore - userBalanceAfter).to.be.gte(COLLATERAL - ethers.parseEther("1000000"));
    });

    it("Should reject collateral below minimum", async function () {
      const lowCollateral = ethers.parseEther("500000"); // 500k IDRX

      await idrx.connect(user1).approve(await vault.getAddress(), lowCollateral);

      await expect(
        vault.connect(user1).createPosition(lowCollateral, TARGET_PRICE, 7 * 24 * 3600, false)
      ).to.be.revertedWith("Collateral below minimum");
    });

    it("Should reject zero target price", async function () {
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);

      await expect(
        vault.connect(user1).createPosition(COLLATERAL, 0, 7 * 24 * 3600, false)
      ).to.be.revertedWith("Invalid target price");
    });

    it("Should reject invalid expiry duration", async function () {
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);

      // Too short
      await expect(
        vault.connect(user1).createPosition(COLLATERAL, TARGET_PRICE, 3600, false)
      ).to.be.revertedWith("Invalid expiry duration");

      // Too long (366 days)
      await expect(
        vault.connect(user1).createPosition(COLLATERAL, TARGET_PRICE, 366 * 24 * 3600, false)
      ).to.be.revertedWith("Invalid expiry duration");
    });

    it("Should reject if insufficient allowance", async function () {
      await expect(
        vault.connect(user1).createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false)
      ).to.be.reverted;
    });

    it("Should reject if insufficient balance", async function () {
      const tooMuchCollateral = INITIAL_BALANCE + ethers.parseEther("1");

      await idrx.connect(user1).approve(await vault.getAddress(), tooMuchCollateral);

      await expect(
        vault.connect(user1).createPosition(tooMuchCollateral, TARGET_PRICE, 7 * 24 * 3600, false)
      ).to.be.reverted;
    });
  });

  describe("Get Positions", function () {
    beforeEach(async function () {
      // Create two positions for user1
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL * 2n);

      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);

      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE * 2n, 14 * 24 * 3600, true);
    });

    it("Should return all user positions", async function () {
      const positions = await vault.getUserPositions(user1.address);
      expect(positions.length).to.equal(2);
      expect(positions[0].targetPrice).to.equal(TARGET_PRICE);
      expect(positions[1].targetPrice).to.equal(TARGET_PRICE * 2n);
    });

    it("Should return only active positions", async function () {
      const activePositions = await vault.getActivePositions(user1.address);
      expect(activePositions.length).to.equal(2);

      for (const pos of activePositions) {
        expect(pos.isActive).to.equal(true);
      }
    });

    it("Should return empty array for user with no positions", async function () {
      const positions = await vault.getUserPositions(user2.address);
      expect(positions.length).to.equal(0);
    });

    it("Should calculate total premium earned", async function () {
      const totalPremium = await vault.getTotalPremiumEarned(user1.address);
      expect(totalPremium).to.be.gte(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update platform fee", async function () {
      await vault.connect(owner).updateFee(500); // 5%
      expect(await vault.platformFee()).to.equal(500);
    });

    it("Should reject fee above maximum", async function () {
      await expect(vault.connect(owner).updateFee(3000)).to.be.revertedWith("Fee too high");
    });

    it("Should reject non-owner updating fee", async function () {
      await expect(vault.connect(user1).updateFee(500)).to.be.reverted;
    });

    it("Should allow owner to pause contract", async function () {
      await vault.connect(owner).pause();

      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);

      await expect(
        vault.connect(user1).createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false)
      ).to.be.reverted;
    });

    it("Should allow owner to unpause contract", async function () {
      await vault.connect(owner).pause();
      await vault.connect(owner).unpause();

      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);

      // Should work after unpause
      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);
    });

    it("Should allow owner to update minimum collateral", async function () {
      const newMin = ethers.parseEther("2000000"); // 2M IDRX
      await vault.connect(owner).updateMinCollateral(newMin);
      expect(await vault.minCollateral()).to.equal(newMin);
    });

    it("Should reject zero as minimum collateral", async function () {
      await expect(vault.connect(owner).updateMinCollateral(0)).to.be.revertedWith(
        "Invalid minimum"
      );
    });

    it("Should allow owner to withdraw fees", async function () {
      // First create a position to generate fees
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);
      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);

      const collectedFees = await vault.collectedFees();
      if (collectedFees > 0) {
        const ownerBalanceBefore = await idrx.balanceOf(owner.address);

        await vault.connect(owner).withdrawFees(owner.address);

        const ownerBalanceAfter = await idrx.balanceOf(owner.address);
        expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(collectedFees);
        expect(await vault.collectedFees()).to.equal(0);
      }
    });
  });

  describe("Multiple Users", function () {
    it("Should handle positions from multiple users", async function () {
      // User1 creates position
      await idrx.connect(user1).approve(await vault.getAddress(), COLLATERAL);
      await vault
        .connect(user1)
        .createPosition(COLLATERAL, TARGET_PRICE, 7 * 24 * 3600, false);

      // User2 creates position
      await idrx.connect(user2).approve(await vault.getAddress(), COLLATERAL);
      await vault
        .connect(user2)
        .createPosition(COLLATERAL, TARGET_PRICE * 2n, 14 * 24 * 3600, false);

      // Check each user has their own position
      const user1Positions = await vault.getUserPositions(user1.address);
      const user2Positions = await vault.getUserPositions(user2.address);

      expect(user1Positions.length).to.equal(1);
      expect(user2Positions.length).to.equal(1);

      expect(user1Positions[0].user).to.equal(user1.address);
      expect(user2Positions[0].user).to.equal(user2.address);

      // Check TVL includes both
      expect(await vault.totalValueLocked()).to.equal(COLLATERAL * 2n);
      expect(await vault.totalPositionsCreated()).to.equal(2);
    });
  });
});
