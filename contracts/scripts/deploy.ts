import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying NUNGGU Vault to Base...\n");

  // Get deployment parameters from environment
  const IDRX_ADDRESS = process.env.IDRX_ADDRESS;
  const THETANUTS_RFQ_ADDRESS = process.env.THETANUTS_RFQ_ADDRESS;
  const AAVE_POOL_ADDRESS = process.env.AAVE_POOL_ADDRESS;
  const ETH_ADDRESS = process.env.ETH_ADDRESS || "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Default ETH placeholder

  // Validate addresses
  if (!IDRX_ADDRESS || !THETANUTS_RFQ_ADDRESS || !AAVE_POOL_ADDRESS) {
    console.error("❌ Error: Missing required environment variables!");
    console.log("\nPlease set the following in your .env file:");
    console.log("  - IDRX_ADDRESS");
    console.log("  - THETANUTS_RFQ_ADDRESS");
    console.log("  - AAVE_POOL_ADDRESS");
    console.log("  - ETH_ADDRESS (optional)");
    process.exit(1);
  }

  console.log("📋 Deployment Configuration:");
  console.log(`  IDRX Token: ${IDRX_ADDRESS}`);
  console.log(`  Thetanuts RFQ: ${THETANUTS_RFQ_ADDRESS}`);
  console.log(`  Aave Pool: ${AAVE_POOL_ADDRESS}`);
  console.log(`  ETH Address: ${ETH_ADDRESS}\n`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deploying with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH\n`);

  // Deploy NUNGGUVault
  console.log("📦 Deploying NUNGGUVault contract...");
  const NUNGGUVault = await ethers.getContractFactory("NUNGGUVault");

  const vault = await NUNGGUVault.deploy(
    IDRX_ADDRESS,
    THETANUTS_RFQ_ADDRESS,
    AAVE_POOL_ADDRESS,
    ETH_ADDRESS
  );

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log(`✅ NUNGGUVault deployed to: ${vaultAddress}\n`);

  // Display contract info
  console.log("📊 Contract Information:");
  console.log(`  Owner: ${await vault.owner()}`);
  console.log(`  Platform Fee: ${await vault.platformFee()} (${(await vault.platformFee()) / 100}%)`);
  console.log(`  Min Collateral: ${ethers.formatEther(await vault.minCollateral())} IDRX`);
  console.log(`  Total Positions: ${await vault.totalPositionsCreated()}`);
  console.log(`  Total Value Locked: ${ethers.formatEther(await vault.totalValueLocked())} IDRX\n`);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      NUNGGUVault: {
        address: vaultAddress,
        constructor: {
          idrx: IDRX_ADDRESS,
          thetanutsRFQ: THETANUTS_RFQ_ADDRESS,
          aavePool: AAVE_POOL_ADDRESS,
          ethAddress: ETH_ADDRESS,
        },
      },
    },
  };

  console.log("📝 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verification instructions
  console.log("\n🔍 To verify on BaseScan, run:");
  console.log(
    `npx hardhat verify --network ${(await ethers.provider.getNetwork()).name} ${vaultAddress} "${IDRX_ADDRESS}" "${THETANUTS_RFQ_ADDRESS}" "${AAVE_POOL_ADDRESS}" "${ETH_ADDRESS}"`
  );

  console.log("\n✨ Deployment complete!");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
