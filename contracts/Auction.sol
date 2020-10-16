pragma solidity ^0.6.2;

import "./HuiToken.sol";

contract Auction {
    //hello
    HuiToken public huiToken;
    address public owner;
    address public wallet;
    uint256 public weiRaised;

    uint256 public openingRate;
    uint256 public currentRate;
    uint256 public reserveRate;
    uint256 public closingRate;

    uint256 public totalPotMinTokens;

    uint256 public openingTime;
    uint256 public closingTime;

    Stages public stage;

    enum Stages {
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

    function updateStage() public view returns (Stages) {
        return stage;
    }
    function updateTimeLeft() public view returns (uint256) {
        return closingTime - now;
    }
    function updateCurrentTokenPrice() public view returns (uint256) {
        return currentRate;
    }
    function updateTokensLeft() public view returns (uint256) {
        return totalPotMinTokens;
    }

    function randomFunciont () public onlyWhileOpen {

    }

    function startAuction() external isOwner {
        openingTime = now;
        closingTime = openingTime + 20 minutes;
    }

    // function stakeBid(address _beneficiary) public payable {
    //     require(_beneficiary != address(0));
    //     require(msg.value > 0, "amount cannot be 0 or less");

    //     weiRaised += msg.value;

    //     if(IsBidding[_beneficiary] == true) {
    //         totalBidAmt[_beneficiary] += msg.value;
    //     }

    //     else {
    //         IsBidding[_beneficiary] = true;
    //         totalBidAmt[_beneficiary] = msg.value;
    //     }
        
    //     emit BidStaked(_beneficiary, msg.value);
    // }

    // function claimTokens() external {
    //     require(auctionEnded == true);
    //     require(IsBidding[msg.sender] == true);

    //     uint weiAmount = BidStaked[msg.sender];
    //     uint tokensOwed = weiAmount/closingRate;
    //     huiToken.transfer(msg.sender, tokensOwed);

    // }
}
