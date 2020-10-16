import React from "react";
import { getCurrentTokenPrice, getStage, startAuction, getTimeLeft, getTokensLeft, placeBid } from "./auction.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TO RETRIEVE FROM CONTRACT
      currentTokenPrice: 0,
      tokensLeft: 1000,
      timeLeft: 20,
      stage: null,

      // ONLY ON FRONTEND
      inputBid: '',
    };
  }


  async componentDidMount() {
    // FUNCTION TO CHECK STAGE OF AUCTION (STARTED? ENDED?)
    this.updateStates()

    // TODO - WATCH FOR EMITS (E.G. ENDING ETC.)
    // let event = contractInstance.event()
    // event.watch(callback)
  }

  // FUNCTION TO GET STAGE
  _updateStage = async () => {
    const stage = await getStage()
    console.log({ stage })
    this.setState({ stage })
  }
  // FUNCTION TO GET TIME LEFT
  _updateTimeLeft = async () => {
    const timeLeft = await getTimeLeft();
    console.log({ timeLeft })
    this.setState({ timeLeft: Math.round(timeLeft / 60) })
  }
  // FUNCTION TO GET TOKENS LEFT
  _updateTokensLeft = async () => {
    const tokensLeft = await getTokensLeft();
    console.log({ tokensLeft })
    this.setState({ tokensLeft })
  }
  // FUNCTION TO GET CURRENT TOKEN PRICE
  _updateCurrentTokenPrice = async () => {
    const currentTokenPrice = await getCurrentTokenPrice();
    console.log({ currentTokenPrice })
    this.setState({ currentTokenPrice })
  }

  // TODO - START AUCTION
  _startAuction = async () => {
    const stage = await startAuction()
    console.log({annoyed: stage})
    this.updateStates()
  }
  // TODO - PLACE BID
  _placeBid = async (amout) => {
    await placeBid(amout)
  }


  // FRONTEND FUNCTIONS
  setBid(e) {
    this.setState({ inputBid: e.target.value });
  }

  submitBid(e) {
    const bid = this.state.inputBid
    if (bid <= 0) {
      alert('Bid cannot be zero or less')
      return
    }
    // TODO - FUNCTION TO CALL CONTRACT TO BUY TOKENS
    this._placeBid(bid)
    this.setState({ inputBid: '' });
  }

  // FUNCTION TO UPDATE ALL STATES
  updateStates() {
    this._updateStage()
    this._updateTimeLeft()
    this._updateTokensLeft()
    this._updateCurrentTokenPrice()
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
            <button className="btn btn-secondary" onClick={this._startAuction.bind(this)}>Start Auction</button>
            <div className="full-width">
              <p>Place bid (in ETH)</p>
              <input className="form-control" type="number" min="1" placeholder="100" value={this.state.inputBid} onChange={this.setBid.bind(this)} ></input>
              <button className="btn btn-secondary" onClick={this.submitBid.bind(this)}>Submit bid</button>
            </div>
            <button className="btn btn-secondary" onClick={this.updateStates.bind(this)}>Update State</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
