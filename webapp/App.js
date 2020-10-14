import React from "react";
import { getCurrentTokenPrice } from "./auction.js"

// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPrice: 2000,
      itemName: "MacBook Pro 15",
      reservePrice: 1000,
      lastForBlocks: 100,
      strategy: localStorage.getItem("linearStrategyAddress") || null,
      // seller: this.accountService.currentAccount
    };

    this.getCurrentTokenPrice = this.getCurrentTokenPrice.bind(this);
  }


  getCurrentTokenPrice = async () => {
    let currentTokenPrice = await getCurrentTokenPrice();
    console.log({ currentTokenPrice })
  }


  render() {
    return (
      <div>
        <h1>Hello</h1>
        <button onClick={this.getCurrentTokenPrice}>calculate current token price</button>
      </div>
    );
  }
}

export default App;
