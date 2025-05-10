// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying LandRegistry...");

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.deployed();
  console.log(`✅ LandRegistry deployed to: ${landRegistry.address}`);

  console.log("Deploying UserManager...");

  const UserManager = await hre.ethers.getContractFactory("UserManager");
  const userManager = await UserManager.deploy(landRegistry.address);
  await userManager.deployed();
  console.log(`✅ UserManager deployed to: ${userManager.address}`);

  console.log("\n✅ Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
