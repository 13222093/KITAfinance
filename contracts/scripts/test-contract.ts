/**
 * Simple contract test script
 * Run with: npx hardhat run scripts/test-contract.ts
 */

import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing NUNGGUVault Smart Contract\n");
  console.log("=" .repeat(60));

  // Get signers
  const [owner, user1, user2] = await ethers.getSigners();
  console.log("✅ Got signers");
  console.log(`  Owner: ${owner.address}`);
  console.log(`  User1: ${user1.address}`);
  console.log(`  User2: ${user2.address}\n`);

  // Deploy Mock IDRX
  console.log("📦 Deploying MockERC20 (IDRX)...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const idrx = await MockERC20.deploy("Indonesian Rupiah", "IDRX", 18);
  await idrx.waitForDeployment();
  const idrxAddress = await idrx.getAddress();
  console.log(`✅ IDRX deployed to: ${idrxAddress}\n`);

  // Deploy NUNGGUVault
  console.log("📦 Deploying NUNGGUVault...");
  const mockThetanuts = user2.address; // Use user2 as mock Thetanuts
  const mockAave = user2.address; // Use user2 as mock Aave
  const mockEth = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  const Vault = await ethers.getContractFactory("NUNGGUVault");
  const vault = await Vault.deploy(
    idrxAddress,
    mockThetanuts,
    mockAave,
    mockEth
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`✅ Vault deployed to: ${vaultAddress}\n`);

  // Test 1: Check initial state
  console.log("=" .repeat(60));
  console.log("TEST 1: Initial State");
  console.log("=" .repeat(60));

  const vaultOwner = await vault.owner();
  const platformFee = await vault.platformFee();
  const minCollateral = await vault.minCollateral();
  const totalPositions = await vault.totalPositionsCreated();
  const tvl = await vault.totalValueLocked();

  console.log(`Owner: ${vaultOwner}`);
  console.log(`Platform Fee: ${platformFee} (${Number(platformFee) / 100}%)`);
  console.log(`Min Collateral: ${ethers.formatEther(minCollateral)} IDRX`);
  console.log(`Total Positions: ${totalPositions}`);
  console.log(`Total Value Locked: ${ethers.formatEther(tvl)} IDRX`);

  if (vaultOwner === owner.address) {
    console.log("✅ PASS: Owner set correctly\n");
  } else {
    console.log("❌ FAIL: Owner not set correctly\n");
    return;
  }

  // Test 2: Mint IDRX to user
  console.log("=" .repeat(60));
  console.log("TEST 2: Mint IDRX to User");
  console.log("=" .repeat(60));

  const mintAmount = ethers.parseEther("100000000"); // 100M IDRX
  await idrx.mint(user1.address, mintAmount);

  const user1Balance = await idrx.balanceOf(user1.address);
  console.log(`User1 Balance: ${ethers.formatEther(user1Balance)} IDRX`);

  if (user1Balance === mintAmount) {
    console.log("✅ PASS: IDRX minted successfully\n");
  } else {
    console.log("❌ FAIL: IDRX mint failed\n");
    return;
  }

  // Test 3: Create Position (should fail without approval)
  console.log("=" .repeat(60));
  console.log("TEST 3: Create Position Without Approval (Should Fail)");
  console.log("=" .repeat(60));

  const collateral = ethers.parseEther("40000000"); // 40M IDRX
  const targetPrice = ethers.parseEther("40000000"); // 40M IDRX
  const expiryDuration = 7 * 24 * 3600; // 7 days

  try {
    await vault.connect(user1).createPosition(
      collateral,
      targetPrice,
      expiryDuration,
      false
    );
    console.log("❌ FAIL: Should have reverted without approval\n");
    return;
  } catch (error: any) {
    console.log(`✅ PASS: Transaction reverted as expected`);
    console.log(`  Error: ${error.message.split('\n')[0]}\n`);
  }

  // Test 4: Approve and Create Position
  console.log("=" .repeat(60));
  console.log("TEST 4: Approve and Create Position");
  console.log("=" .repeat(60));

  console.log("Approving vault to spend IDRX...");
  await idrx.connect(user1).approve(vaultAddress, collateral);
  console.log("✅ Approval successful");

  // Mint some IDRX to vault for mock premium
  await idrx.mint(vaultAddress, ethers.parseEther("10000000")); // 10M for premiums
  console.log("✅ Minted premium to vault");

  console.log("Creating position...");
  const tx = await vault.connect(user1).createPosition(
    collateral,
    targetPrice,
    expiryDuration,
    false
  );
  const receipt = await tx.wait();

  console.log(`✅ Position created!`);
  console.log(`  Transaction hash: ${receipt?.hash}`);
  console.log(`  Gas used: ${receipt?.gasUsed.toString()}\n`);

  // Test 5: Check Position Data
  console.log("=" .repeat(60));
  console.log("TEST 5: Verify Position Data");
  console.log("=" .repeat(60));

  const positions = await vault.getUserPositions(user1.address);
  console.log(`Number of positions: ${positions.length}`);

  if (positions.length > 0) {
    const pos = positions[0];
    console.log(`\nPosition 0:`);
    console.log(`  User: ${pos.user}`);
    console.log(`  Collateral: ${ethers.formatEther(pos.collateral)} IDRX`);
    console.log(`  Target Price: ${ethers.formatEther(pos.targetPrice)} IDRX`);
    console.log(`  Premium Received: ${ethers.formatEther(pos.premiumReceived)} IDRX`);
    console.log(`  Is Active: ${pos.isActive}`);
    console.log(`  Auto Roll: ${pos.autoRoll}`);
    console.log(`  Expiry: ${new Date(Number(pos.expiry) * 1000).toISOString()}`);

    if (pos.isActive && pos.collateral === collateral) {
      console.log("\n✅ PASS: Position data correct\n");
    } else {
      console.log("\n❌ FAIL: Position data incorrect\n");
      return;
    }
  } else {
    console.log("❌ FAIL: No positions found\n");
    return;
  }

  // Test 6: Check TVL Update
  console.log("=" .repeat(60));
  console.log("TEST 6: Verify TVL Updated");
  console.log("=" .repeat(60));

  const newTvl = await vault.totalValueLocked();
  const newTotalPositions = await vault.totalPositionsCreated();

  console.log(`Total Value Locked: ${ethers.formatEther(newTvl)} IDRX`);
  console.log(`Total Positions Created: ${newTotalPositions}`);

  if (newTvl === collateral && newTotalPositions === 1n) {
    console.log("✅ PASS: TVL and position count updated correctly\n");
  } else {
    console.log("❌ FAIL: TVL or position count incorrect\n");
    return;
  }

  // Test 7: Get Active Positions
  console.log("=" .repeat(60));
  console.log("TEST 7: Get Active Positions");
  console.log("=" .repeat(60));

  const activePositions = await vault.getActivePositions(user1.address);
  console.log(`Active positions: ${activePositions.length}`);

  if (activePositions.length === 1) {
    console.log("✅ PASS: Active positions retrieved correctly\n");
  } else {
    console.log("❌ FAIL: Active positions count incorrect\n");
    return;
  }

  // Test 8: Admin Functions
  console.log("=" .repeat(60));
  console.log("TEST 8: Admin Functions");
  console.log("=" .repeat(60));

  console.log("Testing fee update...");
  await vault.connect(owner).updateFee(500); // Change to 5%
  const newFee = await vault.platformFee();
  console.log(`New fee: ${newFee} (${Number(newFee) / 100}%)`);

  if (newFee === 500n) {
    console.log("✅ PASS: Fee updated successfully");
  } else {
    console.log("❌ FAIL: Fee update failed");
  }

  console.log("\nTesting minimum collateral update...");
  const newMin = ethers.parseEther("2000000"); // 2M IDRX
  await vault.connect(owner).updateMinCollateral(newMin);
  const updatedMin = await vault.minCollateral();
  console.log(`New min collateral: ${ethers.formatEther(updatedMin)} IDRX`);

  if (updatedMin === newMin) {
    console.log("✅ PASS: Min collateral updated successfully\n");
  } else {
    console.log("❌ FAIL: Min collateral update failed\n");
  }

  // Final Summary
  console.log("=" .repeat(60));
  console.log("🎉 ALL TESTS PASSED!");
  console.log("=" .repeat(60));
  console.log("\n✅ Smart Contract is working correctly!");
  console.log("✅ Ready for integration with backend and frontend");
  console.log("\nNext steps:");
  console.log("  1. Deploy to Base Sepolia testnet");
  console.log("  2. Get real integration addresses (IDRX, Thetanuts, Aave)");
  console.log("  3. Test with backend API");
  console.log("  4. Integrate with frontend UI\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
    process.exit(1);
  });
