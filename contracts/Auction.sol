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
    uint256 public closingRate;

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

    function startAuction() public isOwner returns (Stages) { // atStage(Stages.AuctionDeployed)
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

        // if(IsBidding[msg.sender] == true) {
        //     totalBidAmt[msg.sender] += msg.value;
        // }
        // else {
        //     IsBidding[msg.sender] = true;
        //     totalBidAmt[msg.sender] = msg.value;
        // }

        // TODO - STORE ETHER IN WALLET IF VALID

        // emit BidStaked(_beneficiary, msg.value);
    }

    // function claimTokens() external {
    //     require(auctionEnded == true);
    //     require(IsBidding[msg.sender] == true);

    //     uint weiAmount = BidStaked[msg.sender];
    //     uint tokensOwed = weiAmount/closingRate;
    //     huiToken.transfer(msg.sender, tokensOwed);

    // }
}
