var DutchAuction = artifacts.require("./Auction.sol");
const walletAddress = "0x0a5b6EcceE0C07dA979A8f3932d3d324989F7B72" // CHANGE THIS TO YOUR WALLET
const openingRate = 100 

module.exports = function(deployer) {
  deployer.deploy(DutchAuction, walletAddress, openingRate);
};