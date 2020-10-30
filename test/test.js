const {BN, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');

const HuiToken = artifacts.require("HuiToken");
const Auction = artifacts.require("Auction");

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract("Auction", async ([deployer, investor1, investor2, investor3, noninvestor]) => {
  describe("auction has been deployed", async () => {
    let auction, huiToken, deploymentTime, openingTime, closingTime, afterClosingTime;

    before(async() => {
      deploymentTime = (await time.latest());
      huiToken = await HuiToken.new({from: deployer});
      auction = await Auction.new(huiToken.address, 10, 2);
      await huiToken.transfer(auction.address, tokens('100').toString(), {from: deployer})
    })

    it("has owner == deployer", async () => {
      let owner = await auction.owner(); // call the getter on public state variable, https://solidity.readthedocs.io/en/v0.7.1/contracts.html#getter-functions
      assert.equal(owner, deployer); // compare the expected owner with the actual owner
    });

    it("should have total token balance == token supply && correctly recorded in HuiToken", async() => {
      let totalTokenBalance = await huiToken.balanceOf(auction.address);
      assert.equal(totalTokenBalance.toString(), tokens('100').toString());
    })

    it("should not allow non owners to start contract", async() => {
      await truffleAssert.fails(
        auction.startAuction({from: investor1})
      );
    })

    it("shoudl be at stage = AuctionDeployed", async() => {
      let stage = await auction.stage();
      assert.equal(stage.toString(), "0");
    })

    it("should not allow investors to stake bids", async() => {
      await truffleAssert.fails(
        auction.stakeBid({from: investor1, value: 10})
      )
    })

    it("should have current price = opening price", async() => {
      let currentPrice = await auction.calcCurrentTokenPrice();
      let openingPrice = await auction.openingRate();
      assert.equal(currentPrice.toString(), openingPrice.toString());
    })
    
    describe("when 10 minutes has passed after auction deployment, but auction not started ", async() => {
      before(async() => {
        await time.increase(time.duration.minutes(10)) //this increase the time globally 
      })

      it("should still have current price = opening price", async() => {
        let currentPrice = await auction.calcCurrentTokenPrice();
        let openingPrice = await auction.openingRate();
        assert.equal(currentPrice.toString(), openingPrice.toString());
      })

      it("should still not allow investors to stake bids", async() => {
        await truffleAssert.fails(
          auction.stakeBid.call({from: investor1, value: 10})
        )
      })
    })

    describe("auction was started 10 minutes after deploying", async() => {
      before(async() => {
        await auction.startAuction({from: deployer});
        openingTime = (await time.latest());
        closingTime = openingTime.add(time.duration.minutes(20));
        afterClosingTime = closingTime.add(time.duration.seconds(1));
      })

      it("shoudl be at stage = AuctionStarted", async() => {
        const stage = await auction.stage();
        assert.equal(stage.toString(), "1");
      })

      it("should have the correct openingTime", async() => {
        let auctionOpeningTime = await auction.openingTime();
        console.log('auction opening time', auctionOpeningTime.toString());
        assert.equal(auctionOpeningTime.toString(), openingTime.toString());
      })

      it("should have the correct closingTime", async() => {
        let auctionClosingTime = await auction.closingTime();
        console.log('auction closing time', auctionClosingTime.toString());
        assert.equal(auctionClosingTime.toString(), closingTime.toString());
      })

      it("should allow investor1 to bid 5 ether", async() => {
        await truffleAssert.passes(
          auction.stakeBid({from: investor1, value: web3.utils.toWei('5', 'ether')})
        )
      })

      it("should show correct total bid amount from an investor", async() => {
        let bidAmount = await auction.totalBidAmt(investor1);
        assert.equal(bidAmount.toString(), (5 * 10**18).toString());
      })

      it("should mark a bidder in isBidding", async() => {
        await auction.stakeBid({from: investor1, value: web3.utils.toWei('5', 'ether')});
        let hasBid = await auction.isBidding(investor1);
        assert.equal(hasBid, true);
      })

      it("should mark a non bidder in isBidding as FALSE", async() => {
        let hasBid = await auction.isBidding(investor2);
        assert.equal(hasBid, false);
      })

      it("should show correct total bid amount from an investor", async() => {
        let bidAmount = await auction.totalBidAmt(investor1);
        assert.equal(bidAmount.toString(), (10 * 10**18).toString());
      })

      it("should show PMT of 1 at the price of 10 for a stake of 10", async() => {
        let bidAmount = await auction.totalBidAmt(investor1);
        let currentPrice = await auction.calcCurrentTokenPrice();
        let pmt = bidAmount/(10**18)/currentPrice;
        assert.equal(pmt, 1);
      })

      describe("10 minutes has passed since auction started", async() => {
        before(async() => {
          await time.increase(time.duration.minutes(10));
        })

        it("current time should be 10 minutes after opening time", async() => {
          let now = (await time.latest());
          let tenMinsAfter = openingTime.add(time.duration.minutes(10));
          assert.equal(now.toString(), tenMinsAfter.toString());
        })

        it("should have a price of 6", async() => {
          let currentPrice = await auction.calcCurrentTokenPrice();
          assert.equal(currentPrice.toString(), '6');
        })

        it("should not allow startAuction() to be called again", async()=> {
          await truffleAssert.fails(
            auction.startAuction({from: deployer})
          )
        })

        describe("18 minutes has passed since auction started", async() => {
          before(async() => {
            await time.increase(time.duration.minutes(8));
          })

          it("current time should be 18 minutes after opening time", async() => {
            let now = (await time.latest());
            let tenMinsAfter = openingTime.add(time.duration.minutes(18));
            assert.equal(now.toString(), tenMinsAfter.toString());
          })

          it("should have a price of 3", async() => {
            let currentPrice = await auction.calcCurrentTokenPrice();
            assert.equal(currentPrice.toString(), '3');
          })

          it("should allow investors to still place bids", async() => {
            await auction.stakeBid({from: investor1, value: web3.utils.toWei('30', 'ether')});
            await auction.stakeBid({from: investor2, value: web3.utils.toWei('20', 'ether')});
            await auction.stakeBid({from: investor3, value: web3.utils.toWei('40', 'ether')});
          })

          it("should correctly reflect bid amount for investor1", async() => {
            let bidAmount1 = await auction.totalBidAmt(investor1);
            assert.equal(bidAmount1.toString(), (40 * 10**18).toString());
          })

          it("should correctly reflect bid amount for investor2", async() => {
            let bidAmount2 = await auction.totalBidAmt(investor2);
            assert(bidAmount2.toString(), (20 * 10**18).toString());
          })

          it("should correctly reflect bid amount for investor3", async() => {
            let bidAmount3 = await auction.totalBidAmt(investor3);
            assert(bidAmount3.toString(), (40 * 10**18).toString());
          })

          it("should not allow investors to claim tokens while auction is running", async() => {
            await truffleAssert.fails(
              auction.claimTokens({from: investor1})
            )
          })

          describe("21 minutes has passed since auction started", async() => {
            before(async() => {
              await time.increase(time.duration.minutes(3));
            })

            it("current time should be 21 minutes after opening time", async() => {
              let now = (await time.latest());
              let tenMinsAfter = openingTime.add(time.duration.minutes(21));
              assert(now.toString(), tenMinsAfter.toString());
            })

            it("should not allow any more staking of bids", async() => {
              await truffleAssert.fails(
                auction.stakeBid({from: investor3, value: web3.utils.toWei('5', 'ether')})
              )
              let latestStage = await auction.stage();
              console.log(latestStage.toString());
            })

            it("should allow investors to claim tokens", async() => {
              await truffleAssert.passes(
                auction.claimTokens({from: investor1})
              )
              await truffleAssert.passes(
                auction.claimTokens({from: investor2})
              )
              await truffleAssert.passes(
                auction.claimTokens({from: investor3})
              )
              let latestStage = await auction.stage();
              console.log(latestStage.toString());
            })

            it("should NOT allow NON-investors to claim tokens", async() => {
              await truffleAssert.fails(
                auction.claimTokens({from: noninvestor})
              )
            })

            it("should have closing price == 2", async() => {
              let closingRate = await auction.closingRate();
              assert.equal(closingRate.toString(), '2');
            })

            it("should correctly reflect token ownership after claiming tokens", async() => {
              let tokenAmount1 = await huiToken.balanceOf(investor1);
              let tokenAmount2 = await huiToken.balanceOf(investor2);
              let tokenAmount3 = await huiToken.balanceOf(investor3);
              assert.equal(tokenAmount1.toString(), tokens('20').toString());
              assert.equal(tokenAmount2.toString(), tokens('10').toString());
              assert.equal(tokenAmount3.toString(), tokens('20').toString());
            })

            it("should correctly reflect remaining tokens left in auction contract after auction ended", async() => {
              let tokenPMT = await auction.totalPotMinTokens();
              let tokenSupply = await auction.totalTokenBalance();
              let excessTokens = tokenSupply - tokenPMT;
              assert.equal(excessTokens.toString(), tokens('50').toString());
            })

            it("should disallow withdrawal by NON-owner", async() => {
              await truffleAssert.fails(
                auction.withdraw({from: investor3})
              )
            })

            it("should allow withdrawal by owner and also burn excess tokens", async() => {
              await truffleAssert.passes(
                auction.withdraw({from: deployer})
              )

              let auctionTokenBal = await huiToken.balanceOf(auction.address);
              assert.equal(auctionTokenBal.toString(), '0');
            })

            
          })

        })

      })


      //   it("should log in investor has staking 100 ether correctly", async() => {
      //     auction.stakeBid.call({from: investor1, value: 10});
      //     let stakeAmount = await auction.isBidding(investor1);
      //     assert.equal(stakeAmount.toString(), '10');
      //   })
      })



  })
});