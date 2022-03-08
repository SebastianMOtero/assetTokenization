
const chai = require('chai');
const expect = chai.expect;
const { ethers } = require("hardhat");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe("MyToken", function () {
  before(async function() {
    this.MyToken = await ethers.getContractFactory("MyToken");
    const [ownerUser, user1, user2] = await ethers.getSigners();
    this.deployer = ownerUser;
    this.users = [user1, user2];
  })
  
  beforeEach(async function() {
    this.myToken = await this.MyToken.deploy(100);
    await this.myToken.deployed();
  });

  it("All tokens should be in my account", async function () {
    const totalSupply = await this.myToken.totalSupply();
    expect(await this.myToken.balanceOf(this.deployer.address)).to.equal(totalSupply);
  });

  it("is not possible to send more tokens than available in total", async function () {
    const balanceDeployer = await this.myToken.balanceOf(this.deployer.address);
    console.log(balanceDeployer)
    expect(this.myToken.transfer(this.users[0].address, balanceDeployer.add(1))).to.eventually.be.rejected;
    expect(this.myToken.balanceOf(this.deployer.address)).to.eventually.be.equal(balanceDeployer);
  })

  it("I can send tokens from Account ownerUser to Account user1", async function () {
    const sendToken = 1;
    const totalSupply = await this.myToken.totalSupply();

    expect(this.myToken.balanceOf(this.deployer.address)).to.eventually.be.equal(totalSupply);
    expect(this.myToken.transfer(this.users[0].address, sendToken)).to.eventually.be.fulfilled;
    expect(this.myToken.balanceOf(this.deployer.address)).to.eventually.be.equal(totalSupply.sub(sendToken));
    expect(this.myToken.balanceOf(this.users[0].address)).to.eventually.be.equal(sendToken);
  })

 
});
