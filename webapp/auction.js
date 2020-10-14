import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { infuraWSS } from './config'
import {
    auctionAddress
} from "./config.js"
import artifact from "../build/contracts/DutchAuction.json"; // TODO CHANGE

const web3 = new Web3(
    Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);
const contract = new web3.eth.Contract(artifact.abi, auctionAddress);

export const getCurrentTokenPrice = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        const price = contract.methods.calcCurrentTokenPrice().call()
        return price
    } else {
        console.log("Please install MetaMask!");
    }
};
