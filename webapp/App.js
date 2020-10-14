import React from "react";
import { getCurrentTokenPrice } from "./auction.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
      // seller: this.accountService.currentAccount,
      currentTokenPrice: 0
    };

    this.getCurrentTokenPrice = this.getCurrentTokenPrice.bind(this);
  }


  getCurrentTokenPrice = async () => {
    let currentTokenPrice = await getCurrentTokenPrice();
    this.setState({ currentTokenPrice })
  }


  render() {
    return (
      <div className="container-fluid body">
        <div className="card">
          <div className="card-body">
            <h1 className="title">Dutch auction</h1>
            <p>Current token price is: {this.state.currentTokenPrice}</p>
            <button className="btn btn-primary" onClick={this.getCurrentTokenPrice}>Update current token price</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
