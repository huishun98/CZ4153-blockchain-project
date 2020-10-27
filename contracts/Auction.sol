pragma solidity ^0.6.2;

import "./HuiToken.sol";

contract Auction {
    HuiToken public huiToken;
    address public owner;
    address public wallet;
    uint256 public weiRaised;

    uint256 public openingRate;
    uint256 public reserveRate;
    uint256 public closingRate; 

    uint256 public totalPotMinTokens;
    uint256 public totalSupply; 
    uint public tokensLeft;

    uint256 public openingTime;
    uint256 public closingTime;

    mapping(address => uint) public totalBidAmt;
    mapping(address => bool) public isBidding;

    Stages public stage;

    enum Stages {
        AuctionDeployed,
        AuctionStarted,
        AuctionEnded
    }

    modifier onlyWhileOpen {
        require(block.timestamp >= openingTime && block.timestamp <= closingTime);
        _;
    }

    modifier atStage(Stages _stage) {
        if (stage != _stage)
            // Contract not in expected state
            revert();
        _;
    }

    modifier isOwner() {
        if (msg.sender != owner)
            // Only owner is allowed to proceed
            revert();
        _;
    }

    modifier isWallet() {
        if (msg.sender != wallet)
            // Only wallet is allowed to proceed
            revert();
        _;
    }

    modifier callerIsBidding() {
        if (!(isBidding[msg.sender]))
            // Only owner is allowed to proceed
            revert();
        _;
    }



    event BidStaked(address beneficiary, uint256 amount);

    constructor(HuiToken _huiToken, uint256 _openingRate, uint256 _reserveRate) public {
        huiToken = _huiToken;
        owner = msg.sender; //owner is the EOA that created this contract 
        wallet = address(this);
        // huiToken.transferFrom(huiToken.getTokenOwner(), wallet, huiToken.balanceOf(owner)); //transfer all tokens to this contract 
        // huiToken.transfer(owner, 1);
        openingRate = _openingRate;
        reserveRate = _reserveRate;

        totalPotMinTokens = 0;
        totalSupply = huiToken.totalSupply();
    }

    function getBalance() public view returns (uint256) {
        return wallet.balance;
    }

    function withdraw() public isOwner atStage(Stages.AuctionEnded){
        msg.sender.transfer(wallet.balance);
    }

    function calcCurrentTokenPrice() public returns (uint256) {
        if (stage == Stages.AuctionDeployed) {
            return openingRate;
        } 
        if (stage == Stages.AuctionStarted || stage == Stages.AuctionEnded) {
            return ((openingRate-reserveRate)*(now-openingTime)/(20 minutes) + openingRate);
        }
    }

    function randomFunction () public onlyWhileOpen {

    }

    function startAuction() public isOwner atStage(Stages.AuctionDeployed) returns (Stages) { // 
        stage = Stages.AuctionStarted;
        openingTime = now;
        closingTime = openingTime + 20 minutes;
        return stage;

        // TODO - ADD ETHEREUM ALARM CLOCK TO END FUNCTION WHEN 20 MINUTES IS UP.
    }

    function terminateAuction() internal {
        stage = Stages.AuctionEnded;
    }

    function stakeBid() public payable atStage(Stages.AuctionStarted) { 
        require(msg.sender != address(0));
        require(msg.value > 0, "amount cannot be 0 or less");
        require(((weiRaised+msg.value)/calcCurrentTokenPrice()) <= totalSupply, "demand exceeds supply!");

        weiRaised += msg.value;
        totalBidAmt[msg.sender] += msg.value; // TODO - CHECK IF VALUE ADDED IS CORRECT
        tokensLeft = totalSupply - (weiRaised/calcCurrentTokenPrice());

        if(isBidding[msg.sender] == true) {
            totalBidAmt[msg.sender] += msg.value;
        }
        else {
            isBidding[msg.sender] = true;
            totalBidAmt[msg.sender] = msg.value;
        }

        // emit BidStaked(_beneficiary, msg.value);
    }

    // GETTERS
    function getBid() public view callerIsBidding returns (uint256) {
        return totalBidAmt[msg.sender];
    }

    // TODO - ALLOW USER TO CLAIM TOKENS
    function claimTokens() public callerIsBidding { //atStage(Stages.AuctionEnded)
        uint userBidAmt = totalBidAmt[msg.sender]; 
        totalBidAmt[msg.sender] = 0;
        uint tokensOwed = userBidAmt/calcCurrentTokenPrice(); 
        huiToken.transfer(msg.sender, tokensOwed); // TODO - BUG - VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance
    }
}
