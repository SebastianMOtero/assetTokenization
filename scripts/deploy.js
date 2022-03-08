const hre = require("hardhat");

async function main() {
  const initialSupply = 1000000;
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);
  
  const [ownerUser] = await hre.ethers.getSigners();
  
  const KycContract = await hre.ethers.getContractFactory("KycContract");
  const kycContract = await KycContract.deploy();
  console.log("kycContract deployed to:", kycContract.address);

  const MyTokenSale = await hre.ethers.getContractFactory("MyTokenSale");
  const myTokenSale = await MyTokenSale.deploy(1, ownerUser.address, myToken.address, kycContract.address);
  await myTokenSale.deployed();
  console.log("MyTokenSale deployed to:", myTokenSale.address);

  await myToken.transfer(myTokenSale.address, initialSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
