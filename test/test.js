const {BN, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');

const HuiToken = artifacts.require("HuiToken");
const Auction = artifacts.require("Auction");

function tokens(n) {
  return web3.utils.toWei(n, 'ether').toString();
}

contract("Auction", async ([deployer, investor1, investor2]) => {
  describe("Auction deployemnet", async () => {
    let auction, huiToken, openingTime, closingTime, afterClosingTime;

    beforeEach(async() => {
      openingTime = (await time.latest());
      closingTime = openingTime.add(time.duration.minutes(20));
      afterClosingTime = closingTime.add(time.duration.seconds(1));
      huiToken = await HuiToken.new({from: deployer});
      auction = await Auction.new(huiToken.address, 10, 2);
      await huiToken.transfer(auction.address, tokens('1000'), {from: deployer})
    })
    it("has owner == deployer", async () => {
      let owner = await auction.owner(); // call the getter on public state variable, https://solidity.readthedocs.io/en/v0.7.1/contracts.html#getter-functions
      assert.equal(owner, deployer); // compare the expected owner with the actual owner
    });
  
    it("should have token balance == total token supply", async() => {
      let totalTokenSupply = await huiToken.totalSupply();
      assert.equal(totalTokenSupply.toString(), tokens('1000'));
    });

    it("should have total token supply", async() => {
      let totalTokenBalance = await huiToken.balanceOf(auction.address);
      assert.equal(totalTokenBalance.toString(), tokens('1000'));
    })

    describe("when 10 minutes has passed", async() => {

    })
  })

  

    // it("can deposit correctly", async () => {
    //   let bank = await Bank.deployed();
    //   // sending 3 Ether to deposit() function from accounts[4],
    //   // Note that deposit() function in the contract doesn't have any input parameter,
    //   // but in test, we are allowed to pass one optional special object specifying ethers to send to this
    //   // contract while we are making this function call.
    //   // Another similar example here: https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#making-a-transaction
    //   let result = await bank.deposit({
    //     from: accounts[4],
    //     value: web3.utils.toWei("3"), // all amount are expressed in wei, this is 3 Ether in wei
    //   });

    //   // get deposited balance
    //   let deposited = await bank.balance({ from: accounts[4] });
    //   assert.equal(deposited.toString(), web3.utils.toWei("3"));
    // });

    // it("can withdraw less than despoited", async () => {
    //   let bank = await Bank.deployed();
    //   await bank.deposit({
    //     from: accounts[0],
    //     value: web3.utils.toWei("3"),
    //   });
    //   await bank.withdraw(web3.utils.toWei("2.9"), { from: accounts[0] });

    //   let deposited = await bank.balance({ from: accounts[0] });
    //   assert.equal(deposited.toString(), web3.utils.toWei("0.1"));
    // });
});