pragma solidity ^0.6.2;

import "./HuiToken.sol";

contract Auction {
    //hello
    HuiToken public huiToken;
    address public owner;
    address public wallet;
    uint256 public weiRaised;

    uint256 public openingRate;
    // uint256 public currentRate; // may not need current rate due to calcCurrentTokenPrice()
    uint256 public reserveRate;
    // uint256 public closingRate; // may not need current rate due to calcCurrentTokenPrice()

    uint256 public totalPotMinTokens;

    uint256 public openingTime;
    uint256 public closingTime;

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

    mapping(address => uint) public totalBidAmt;
    mapping(address => bool) public IsBidding;

    event BidStaked(address beneficiary, uint256 amount);

    constructor(HuiToken _huiToken, uint256 _rate) public {
        huiToken = _huiToken;
        owner = msg.sender;
        openingRate = _rate;
        totalPotMinTokens = 0;
        // TODO - ADD RESERVE RATE
    }

    function calcCurrentTokenPrice() public returns (uint256) {
        if (stage == Stages.AuctionDeployed) {
            return openingRate;
        } 
        if (stage == Stages.AuctionStarted || stage == Stages.AuctionEnded) {
            // TODO - MATH TO CALCULATE CURRENT TOKEN PRICE
            uint256 currentRate = openingRate;
            return currentRate;
        }
    }


    function randomFunciont () public onlyWhileOpen {

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

        // TODO - TAKE NOTE OF VALUE STAKED BY BIDDER

        weiRaised += msg.value;
        totalBidAmt[msg.sender] = msg.value;

        // TODO - CHECK THAT NUMBER OF TOKENS LEFT IS ENOUGH
        // TODO - STORE ETHER IN WALLET IF VALID

        // if(IsBidding[msg.sender] == true) {
        //     totalBidAmt[msg.sender] += msg.value;
        // }
        // else {
        //     IsBidding[msg.sender] = true;
        //     totalBidAmt[msg.sender] = msg.value;
        // }

        // emit BidStaked(_beneficiary, msg.value);
    }

    // TODO - ALLOW USER TO CLAIM TOKENS
    function claimTokens() public { // atStage(Stages.AuctionEnded)
        uint bidAmt = totalBidAmt[msg.sender]; 
        require (bidAmt > 0, "No more tokens for you!"); // user has either collected or has not bid.
        totalBidAmt[msg.sender] = 0;
        uint tokensOwed = bidAmt/calcCurrentTokenPrice(); 
        huiToken.transfer(msg.sender, tokensOwed); // TODO - BUG - VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance
    }
}
