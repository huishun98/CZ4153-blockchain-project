import React from "react";
import { getCurrentTokenPrice, getStage, startAuction } from "./auction.js"
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
      currentTokenPrice: 0,
      stage: "unset"
    };

    this._getCurrentTokenPrice = this._getCurrentTokenPrice.bind(this);
    this._startAuction = this._startAuction.bind(this);
    this._getStage = this._getStage.bind(this);
  }


  _getCurrentTokenPrice = async () => {
    let currentTokenPrice = await getCurrentTokenPrice();
    this.setState({ currentTokenPrice })
  }

  _startAuction = async () => {
    let start = await startAuction()
    // this.setState({ stage })
  }

  _getStage = async () => {
    let stage = await getStage()
    this.setState({ stage })
  }


  render() {
    return (
      <div className="container-fluid body">
        <div className="card">
          <div className="card-body">
            <h1 className="title">Dutch auction</h1>
            <p>Current token price is: {this.state.currentTokenPrice}</p>
            <button className="btn btn-primary" onClick={this._getCurrentTokenPrice}>Update current token price</button>
            <p>Current stage is: {this.state.stage}</p>
            <button className="btn btn-secondary" onClick={this._getStage}>Update stage</button>
            <button className="btn btn-secondary" onClick={this._startAuction}>Start auction</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
