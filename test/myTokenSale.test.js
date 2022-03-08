
const chai = require('chai');
const expect = chai.expect;
const { ethers } = require("hardhat");

describe("MyTokenSale", function () {
  before(async function () {
    this.KycContract = await ethers.getContractFactory("KycContract");
    this.MyTokenSale = await ethers.getContractFactory("MyTokenSale");
    this.MyToken = await ethers.getContractFactory("MyToken");
    const [ownerUser, user1, user2] = await ethers.getSigners();
    this.deployer = ownerUser;
    this.users = [user1, user2];
  })

  beforeEach(async function () {
    this.myToken = await this.MyToken.deploy(100);
    await this.myToken.deployed();

    this.kycContract = await this.KycContract.deploy();
    await this.kycContract.deployed();

    this.myTokenSale = await this.MyTokenSale.deploy(1, this.deployer.address, this.myToken.address, this.kycContract.address);
    await this.myTokenSale.deployed();

    const s = await this.myToken.transfer(this.myTokenSale.address, 100);
    await s.wait();
  });

  it("should not have any tokens in my deployerAccount", async function () {
    expect(await this.myToken.balanceOf(this.deployer.address)).to.equal(0);
  });

  it("all tokens should be in the TokenSale Smart Contract by default", async function () {
    let balanceOfTokenSaleSmartContract = await this.myToken.balanceOf(this.myTokenSale.address);
    let totalSupply = await this.myToken.totalSupply();
    expect(balanceOfTokenSaleSmartContract).to.equal(totalSupply);
  })
});
