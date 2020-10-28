// this script will be run after 1_initial_migration.js
// as you guessed, the naming convention which starts with a number, e.g. "1_xxx.js", tells Truffle the order
// by which it should run these migration scripts.

const Bank = artifacts.require("Bank"); // importing artifacts from Truffle compile
const HuiToken = artifacts.require("HuiToken");
const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
  // deployer is an object provided by Truffle to handle migration
  deployer.deploy(Bank); // now, we ask deployer to deploy our Bank.sol contract
  // deployer.deploy(HuiToken).then(function() {
  //   return deployer.deploy(Auction, HuiToken.address, 10, 2);
  // });
};