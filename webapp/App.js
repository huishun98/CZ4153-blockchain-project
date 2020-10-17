import React from "react";
import { getCurrentTokenPrice, getStage, startAuction, getClosingTime, getWeiRaised, placeBid } from "./auction.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { timers } from "jquery";

// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TO RETRIEVE FROM CONTRACT
      currentTokenPrice: 0,
      tokensLeft: 1000,
      timeLeft: "",
      stage: null,

      // ONLY ON FRONTEND
      inputBid: '',
      countingDown: false,
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

    // if auction has started and counting down has not started, start countdown
    if (stage == "1" && !this.countingDown) {
      this.countingDown = true
      this.regularUpdate()
    } else if (stage == "1") {
      this.regularUpdate()
    } else if (stage == "2") {
      this.setTimeState(0)
    } else {
      this.setTimeState(1200)
    }
  }
  // FUNCTION TO GET TIME LEFT
  _updateTimeLeft = async () => {
    const closingTime = await getClosingTime();
    const now = new Date();
    let timeLeft = (closingTime.getTime() - now.getTime()) / 1000;
    if (timeLeft < 0) {
      this.countingDown = false
      timeLeft = 0
    }
    console.log({ timeLeft })
    this.setTimeState(timeLeft)
    return timeLeft
  }
  // FUNCTION TO GET TOKENS LEFT
  _updateTokensLeft = async () => {
    const weiRaised = await getWeiRaised();
    const currentTokenPrice = await this._updateCurrentTokenPrice();
    this.setState({ tokensLeft: (1000 - weiRaised / 10 ** 18 / currentTokenPrice).toFixed(5) })
  }
  // FUNCTION TO GET CURRENT TOKEN PRICE
  _updateCurrentTokenPrice = async () => {
    const currentTokenPrice = await getCurrentTokenPrice();
    console.log({ currentTokenPrice })
    this.setState({ currentTokenPrice })
    return currentTokenPrice
  }

  // TODO - START AUCTION
  _startAuction = async () => {
    await startAuction()
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

  setTimeState(timer) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({ timeLeft: `${minutes}:${seconds}` })
  }

  submitBid(e) {
    const bid = this.state.inputBid
    if (bid <= 0) {
      alert('Bid cannot be zero or less')
      return
    }
    this._placeBid(bid)
    this.setState({ inputBid: '' });
  }

  regularUpdate = () => {
    const _this = this
    setTimeout(function () {
      if (_this.countingDown) {
        _this._updateTokensLeft()
        _this._updateTimeLeft()
        _this.regularUpdate()
      }
    }, 1000)
  }

  // FUNCTION TO UPDATE ALL STATES
  updateStates() {
    this._updateStage()
    this._updateTokensLeft()
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
            <button className={`btn btn-secondary ${this.state.stage == "1" ? "disabled" : ""}`} onClick={this._startAuction.bind(this)}>Start Auction</button>
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
