# CZ4153 Blockchain Project

Note that there are two config files, [one for the backend](config.js) located in project root, and [one for the webapp](webapp/config.js) located in the webapp folder. These credentials can be found from infura account. Detailed instructions can be found [here](https://github.com/BlockchainCourseNTU/resource/tree/master/development/hello-dapp#step-43-register-an-infura-account).

For project instructions, see [ProjectA_DevProject.docx](ProjectA_DevProject.docx) located in project root.


## Running development server (locally)

1. Open Ganache to start local server.
2. In project root, run `truffle migrate`.
3. Get contract address of 'Auction' contract and update localAuctionAddress in webapp/config.js.
4. To start dApp, cd to `webapp` directory and run `npm start`.
5. Log into Metamask to conduct transactions. Only auction contract's deployer can start the auction.


## Features
### Basic features
1. New token defined and implemented using the ERC20 standard
2. Auction contract follows Dutch auction logic
3. Only elapse for 20 minutes, either all tokens get sold out at clearing price no lower than the reserved price, or only part of total token supply get sold with the remaining tokens burned by the auction contract
4. Distribution of tokens minted to legitimate bidders at the end of the auction
### Advanced features
1. Auction duration/countdown clock in blockchain
2. Token contract wrapped with auction contract
3. Unsold tokens burned by owner
4. Enforce successful bidder to pay Ether for the new token, (I.e. they can’t cancel the bid) and refund bids that are invalid using require() function

See more in test/tests.js for more proof of business logic functionalities 


## Tricky Points to Ponder

### How to enforce auction duration/countdown clock in blockchain?
1. `now` in contract updates only when there is a transaction, and a transaction does not happen in a view function ([reference](https://ethereum.stackexchange.com/questions/39149/solidity-now-does-not-update-in-view-function)). Hence, we store the closing time in the blockchain and let the frontend retrieve the closing time and calculate the remaining time every second, to maintain time consistency between the frontend and the backend.
2. To further ensure that the bidding is only valid during the timeframe of the auction, we used a modifier (checkForAuctionTimeOut) to check that auction is successfully terminated past its closing time, and is triggered 


## Assumptions/Points to note
1. 100 tokens are created and all 100 tokens are transferred to contract
2. excess tokens are burnt upon withdrawal of ether from auction contract by the deployer of the contract, which can only be done after the auction has ended 