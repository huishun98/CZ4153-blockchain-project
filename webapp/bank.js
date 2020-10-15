import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import {
  BankContractAddress
} from "./config.js"

// importing a compiled contract artifact which contains function signature etc. to interact
import artifact from "../build/contracts/Bank.json";

import { myAddress, infuraWSS } from './config'

const web3 = new Web3(
  Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);
const contract = new web3.eth.Contract(artifact.abi, BankContractAddress);

export const updateDeposit = async (addr) => {
  const newBalance = await contract.methods.balance().call({ from: addr });
  return { address: addr, deposit: newBalance };
};

export const newDeposit = async (amount) => {
  // Using MetaMask API to send transaction
  const provider = await detectEthereumProvider();
  if (provider) {
    ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: ethereum.selectedAddress,
          to: BankContractAddress,
          value: web3.utils.toWei(amount),
          data: web3.eth.abi.encodeFunctionCall(
            {
              name: "deposit",
              type: "function",
              inputs: [],
            },
            []
          ), // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html#encodefunctioncall
          chainId: 3, // ropsten
        },
      ],
    });
  } else {
    console.log("Please install MetaMask!");
  }
};
