# CZ4153 Blockchain Project

## Description

This is a project for NTU's Blockchain course, CZ4153.


## Setting up

You may find the detailed set up instructions in the repository [here](https://github.com/BlockchainCourseNTU/resource/tree/master/development/hello-dapp).

Remember to add a .secret file in project root containing secret phrase provided by MetaMask.

Note that there are two config files, [one for the backend](config.js) located in project root, and [one for the webapp](webapp/config.js) located in the webapp folder. These credentials can be found from infura account. Detailed instructions can be found [here](https://github.com/BlockchainCourseNTU/resource/tree/master/development/hello-dapp#step-43-register-an-infura-account).

For project instructions, see [ProjectA_DevProject.docx](ProjectA_DevProject.docx) located in project root.


## Running development server (locally)

1. Open Ganache to start local server. Get account address and update config.js in webapp/config.js.
2. In project root, run `truffle migrate`.
3. Get contract address of 'Auction' contract and update config.js in webapp/config.js.
4. To start dApp, enter `webapp` directory and run `npm start`.

