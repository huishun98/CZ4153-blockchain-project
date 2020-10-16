pragma solidity ^0.6.2;

import "./HuiToken.sol";

contract Auction {
    //hello
    HuiToken public huiToken;
    address public owner;
    uint256 public weiRaised;

    uint256 public openingRate;
    uint256 public currentRate;
    uint256 public reserveRate;
    uint256 public closingRate;

    uint256 public totalPotMinTokens;

    bool public auctionEnded;

    uint256 public openingTime;
    uint256 public closingTime;

    mapping(address => uint256) public totalBidAmt;
    mapping(address => bool) public IsBidding;

    event BidStaked(address beneficiary, uint256 amount);

    constructor(HuiToken _huiToken, uint256 _rate) public {
        huiToken = _huiToken;
        owner = msg.sender;
        openingRate = _rate;
        totalPotMinTokens = 0;
    }

    function startAuction() public {
        require(msg.sender == owner);

        // TODO: start countdown

        auctionEnded = false;
    }

    // TODO: function to change price of tokeni

    function stakeBid(address _beneficiary) public payable {
        require(_beneficiary != address(0));
        require(msg.value > 0, "amount cannot be 0 or less");

        weiRaised = weiRaised + msg.value;

        if (IsBidding[_beneficiary] == true) {
            totalBidAmt[_beneficiary] += msg.value;
        } else {
            IsBidding[_beneficiary] = true;
            totalBidAmt[_beneficiary] = msg.value;
        }

        emit BidStaked(_beneficiary, totalBidAmt[_beneficiary]);
    }

    // 

    function claimTokens() external {
        require(auctionEnded == true);
        require(IsBidding[msg.sender] == true);

        uint256 weiAmount = totalBidAmt[msg.sender];
        uint256 tokensOwed = weiAmount / closingRate;
        huiToken.transfer(msg.sender, tokensOwed);
    }
}
