import React from "react";
import { getCurrentTokenPrice, getStage, startAuction } from "./auction.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // initialPrice: 2000,
      // itemName: "MacBook Pro 15",
      // reservePrice: 1000,
      // lastForBlocks: 100,
      // strategy: localStorage.getItem("linearStrategyAddress") || null,
      // seller: this.accountService.currentAccount,
      currentTokenPrice: 0,
      tokensLeft: 1000,
      timeLeft: 20,
      inputBid: '',
      // stage: "unset"
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

  // frontend functions
  setBid(e) {
    this.setState({ inputBid: e.target.value });
  }

  submitBid(e) {
    const bid = Number(this.state.inputBid)
    if(bid <= 0) {
      alert('Bid cannot be zero or less')
      return
    }
    // TODO - FUNCTION TO CALL CONTRACT
    this.setState({ inputBid: '' });
  }


  render() {
    return (
      <div className="container-fluid body">
        <div className="card">
          <div className="card-body">
            <h1 className="title">Dutch auction</h1>
            <div className="price-wrapper">
              <span className="price bold">{this.state.currentTokenPrice} ETH</span>
              <span>Current price</span>
            </div>
            <div className="flex light-text">
              <span>Tokens left</span>
              <span>Time left</span>
            </div>
            <div className="flex bold highlight">
              <p>{this.state.tokensLeft}</p>
              <p>{this.state.timeLeft} min</p>
            </div>
            <button className="btn btn-secondary">Start Auction</button>
            <div className="full-width">
              <p>Place bid (in ETH)</p>
              <input className="form-control" type="number" min="1" placeholder="100" value={this.state.inputBid} onChange={this.setBid.bind(this)} ></input>
              <button className="btn btn-secondary" onClick={this.submitBid.bind(this)}>Submit bid</button>
            </div>
            {/* <p>Current token price is: {this.state.currentTokenPrice}</p>
            <button className="btn btn-primary" onClick={this._getCurrentTokenPrice}>Update current token price</button>
            <p>Current stage is: {this.state.stage}</p>
            <button className="btn btn-secondary" onClick={this._getStage}>Update stage</button>
            <button className="btn btn-secondary" onClick={this._startAuction}>Start auction</button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
