// import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { infuraWSS } from './config'
import {
    auctionAddress, localAuctionAddress
} from "./config.js"
import artifact from "../build/contracts/Auction.json";

const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545")
    // || Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);

// const contract = new web3.eth.Contract(artifact.abi, auctionAddress);
const contract = new web3.eth.Contract(artifact.abi, localAuctionAddress);
// const contracttemplate = require("@truffle/contract");
// const contract = contracttemplate({ abi: artifact.abi });

export const startAuction = async () => {
    // Using MetaMask API to send transaction
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.startAuction().send({ from: ethereum.selectedAddress })
    } else {
        console.log("Please install MetaMask!");
    }
};
export const collectTokens = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.claimTokens().send({ from: ethereum.selectedAddress })
    } else {
        console.log("Please install MetaMask!");
    }
}
export const placeBid = async (amount) => {
    const provider = await detectEthereumProvider();
    if (provider) {
        ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: ethereum.selectedAddress,
                    to: localAuctionAddress,
                    value: web3.utils.toHex(web3.utils.toWei(amount)),
                    data: web3.eth.abi.encodeFunctionCall(
                        {
                            name: "stakeBid",
                            type: "function",
                            inputs: [],
                        },
                        []
                    ),
                    chainId: 3,
                },
            ],
        });
    } else {
        console.log("Please install MetaMask!");
    }
};
export const terminateAuction = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.terminateAuction().send({ from: ethereum.selectedAddress })
    } else {
        console.log("Please install MetaMask!");
    }
}

// GETTING DATA
export const checkNumOfTokens = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.checkNumOfTokens().call({ from: ethereum.selectedAddress })
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getUsersBid = async () => {
    const provider = await detectEthereumProvider();

    if (ethereum.selectedAddress == null) {
        return null
    } else if (provider) {
        return contract.methods.totalBidAmt(ethereum.selectedAddress).call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getStage = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.stage().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getClosingTime = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        const closingTime = await contract.methods.closingTime().call()
        return new Date(closingTime * 1000)
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getWeiRaised = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.weiRaised().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getOpeningTime = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        const openingTime = await contract.methods.openingTime().call()
        return new Date(openingTime * 1000)
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getReserveRate = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.reserveRate().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getOpeningRate = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.openingRate().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getClosingRate = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.closingRate().call()
    } else {
        console.log("Please install MetaMask!");
    }
};
export const getTotalTokenBalance = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return contract.methods.totalTokenBalance().call()
    } else {
        console.log("Please install MetaMask!");
    }
};