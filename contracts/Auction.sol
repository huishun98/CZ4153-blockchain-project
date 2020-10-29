// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

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
    uint256 public totalTokenBalance; 
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

    // modifier checkSupply() {
    //     if ((weiRaised+weiAmount)/calcCurrentTokenPrice()) > totalTokenBalance)
    //         revert();
    //     _;
    // }

    modifier checkForAuctionTimeOut() {
        if (stage == Stages.AuctionStarted && now >= closingTime)
            terminateAuction(); //set closing price and set stage = AuctionEnded
        _;
    }


    event BidStaked(address beneficiary, uint256 amount);

    constructor(HuiToken _huiToken, uint256 _openingRate, uint256 _reserveRate) public {
        require(_openingRate > 0);
        require(_reserveRate > 0);
        // require(address(huiToken) != address(0));

        huiToken = _huiToken;
        owner = msg.sender; 
        wallet = address(this);

        openingRate = _openingRate;
        reserveRate = _reserveRate;

        totalPotMinTokens = 0;
        totalTokenBalance = huiToken.balanceOf(owner);

        stage = Stages.AuctionDeployed;
    }

    function withdraw() public isOwner {
        msg.sender.transfer(wallet.balance);
    }

    function calcCurrentTokenPrice() public view returns (uint256) { // checkForAuctionTimeOut // note that this only works when transaction is sent
        if (stage == Stages.AuctionDeployed) {
            return openingRate;
        }
        if (stage == Stages.AuctionEnded) {
            return closingRate;
        }
        uint delta = (openingRate-reserveRate)*(now-openingTime)/(20*60);
        return (openingRate - delta);
    }

    function startAuction() public isOwner atStage(Stages.AuctionDeployed) {
        stage = Stages.AuctionStarted;
        openingTime = now;
        closingTime = openingTime + 20 minutes;
    
    }

    function terminateAuction() internal {
        //When Auction ends, stop clock
        //Money sent from owners to senders via Claim Tokens
        
        closingRate = calcCurrentTokenPrice();
        stage = Stages.AuctionEnded;
        claimTokens();
    }

    function stakeBid() public payable atStage(Stages.AuctionStarted) { // checkForAuctionTimeOut
        require(msg.sender != address(0));
        require(msg.value > 0, "amount cannot be 0 or less");
        uint256 weiAmount = msg.value;
        require(((weiRaised+weiAmount)/calcCurrentTokenPrice()) <= totalTokenBalance, "demand exceeds supply!");
        
        weiRaised += weiAmount;
        if (weiRaised/calcCurrentTokenPrice() == totalTokenBalance) {
            terminateAuction();
        }
        
        if(isBidding[msg.sender] == true) {
            totalBidAmt[msg.sender] += msg.value;
        }
        else {
            isBidding[msg.sender] = true;
            totalBidAmt[msg.sender] = msg.value;
        }

        // emit BidStaked(_beneficiary, msg.value);
    }

    function getBid() public view callerIsBidding returns (uint256) { // checkForAuctionTimeOut
        return totalBidAmt[msg.sender];
    }

    function checkNumOfTokens() public view returns (uint256) { // atStage(Stages.AuctionEnded)
       return huiToken.balanceOf(msg.sender);
    }

    function claimTokens() public callerIsBidding atStage(Stages.AuctionEnded) {
        uint userBidAmt = totalBidAmt[msg.sender]; 
        totalBidAmt[msg.sender] = 0;
        uint256 tokensOwed = userBidAmt/(10**18)/closingRate; 
        huiToken.transfer(msg.sender, tokensOwed);
    }
}