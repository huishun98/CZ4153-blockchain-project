import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { infuraWSS } from './config'
import {
    auctionAddress
} from "./config.js"
import artifact from "../build/contracts/Auction.json";

const web3 = new Web3(
    Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);

// const contract = new web3.eth.Contract(artifact.abi, auctionAddress);
const contracttemplate = require("@truffle/contract");
const contract = contracttemplate({abi: artifact.abi});

// export const getCurrentTokenPrice = async () => {
//     // Using MetaMask API to send transaction
//     const provider = await detectEthereumProvider();
//     if (provider) {
//         const price = contract.methods.calcCurrentTokenPrice().call()
//         return price
//     } else {
//         console.log("Please install MetaMask!");
//     }
// };

export const getStage = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        const stage = contract.methods.updateStage().call()
        return stage
    } else {
        console.log("Please install MetaMask!");
    }
};

export const startAuction = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        const start = contract.methods.startAuction().call()
        console.log({start})
        return start
    } else {
        console.log("Please install MetaMask!");
    }
};