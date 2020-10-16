// import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
// import Web3 from "web3";
import { infuraWSS } from './config'
import {
    auctionAddress, localAuctionAddress
} from "./config.js"
import artifact from "../build/contracts/Auction.json";

const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545") || Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);

// const contract = new web3.eth.Contract(artifact.abi, auctionAddress);
const contract = new web3.eth.Contract(artifact.abi, localAuctionAddress);
// const contracttemplate = require("@truffle/contract");
// const contract = contracttemplate({ abi: artifact.abi });

export const startAuction = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        const start = contract.methods.startAuction().call()
        console.log({ start })
        return start
    } else {
        console.log("Please install MetaMask!");
    }
};
// TO-DO - CREATE PLACEBID FUNCTION IN CONTRACT AND CALL
export const placeBid = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        const start = contract.methods.startAuction().call()
        console.log({ start })
        return start
    } else {
        console.log("Please install MetaMask!");
    }
};

// GETTING DATA
export const getStage = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.updateStage().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getTimeLeft = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.updateTimeLeft().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getTokensLeft = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.updateTokensLeft().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getCurrentTokenPrice = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.updateCurrentTokenPrice().call()
    } else {
        console.log("Please install MetaMask!");
    }
};




// LISTENING TO EVENTS
// App.contracts.Evoting.deployed().then(function (instance) {
//     // Restart Chrome if you are unable to receive this event
//     // This is a known issue with MetaMask
//     // https://github.com/MetaMask/metamask-extension/issues/2393
//     instance.votedEvent({}, {
//         fromBlock: 0,
//         toBlock: 'latest'
//     }).watch(function (error, event) {
//         console.log("event triggered", event)
//         // Reload when a new vote is recorded
//         App.render();
//     });
// });