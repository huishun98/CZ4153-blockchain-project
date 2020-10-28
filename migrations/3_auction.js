const Bank = artifacts.require("Bank"); // importing artifacts from Truffle compile
const HuiToken = artifacts.require("HuiToken");
const Auction = artifacts.require("Auction");

module.exports = async function (deployer, network, accounts) {
    // deployer is an object provided by Truffle to handle migration
    // deployer.deploy(Bank); // now, we ask deployer to deploy our Bank.sol contract

    await deployer.deploy(HuiToken);
    const huiToken = await HuiToken.deployed();

    await deployer.deploy(Auction, huiToken.address, 10, 2);
    const auction = await Auction.deployed();

    await huiToken.transfer(auction.address, '1000000000000000000000')
};