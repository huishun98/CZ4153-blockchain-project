import React from "react";
import { checkNumOfTokens, getTotalTokenBalance, terminateAuction, getClosingRate, getOpeningRate, getOpeningTime, getReserveRate, getStage, startAuction, getClosingTime, getWeiRaised, placeBid, collectTokens, getUsersBid } from "./auction.js"
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
      timeLeft: "",
      stage: null,
      usersBid: 0,
      // ONLY ON FRONTEND
      inputBid: '',
      countingDown: false,
      tab: 0,
    };
  }


  async componentDidMount() {
    // FUNCTION TO CHECK STAGE OF AUCTION (STARTED? ENDED?)
    this.updateStates()
  }

  // FUNCTION TO GET STAGE
  _updateStage = async () => {
    const stage = await getStage()
    console.log({ stage })
    this.setState({ stage })

    // if auction has started and counting down has not started, start countdown
    if (stage == "1" && !this.state.countingDown) {
      this.setState({ countingDown: true })
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
      this.setState({ countingDown: false })
      alert('Auction has ended.')
      timeLeft = 0

      const stage = await getStage()
      if (stage !== "2") {
        await terminateAuction()
        this._updateStage()
      }
    }
    this.setTimeState(timeLeft)
    return timeLeft
  }
  // FUNCTION TO GET TOKENS LEFT
  _updateTokensLeft = async () => {
    const weiRaised = await getWeiRaised();
    const currentTokenPrice = await this._updateCurrentTokenPrice();
    this.setState({ tokensLeft: (1000 - weiRaised / 10 ** 18 / currentTokenPrice).toFixed(0) })
  }
  // FUNCTION TO GET CURRENT TOKEN PRICE
  _updateCurrentTokenPrice = async () => {
    const reserveRate = await getReserveRate();
    const openingRate = await getOpeningRate();
    let currentTokenPrice = openingRate;

    if (this.state.stage == "1") {
      const openingTime = await getOpeningTime();
      const now = new Date();
      const delta = (openingRate - reserveRate) * (now - openingTime) / (20 * 60 * 1000);
      currentTokenPrice = (openingRate - delta).toFixed(0);
    } else if (this.state.stage == "2") {
      currentTokenPrice = await getClosingRate();
    }
    this.setState({ currentTokenPrice })
    return currentTokenPrice
  }
  // FUNCTION TO GET USER'S BID
  _updateUsersBid = async () => {
    await getUsersBid().then((usersBidInWei) => {
      const usersBid = (usersBidInWei / 10 ** 18).toFixed(2)
      this.setState({ usersBid })
      return usersBid
    }).catch(err => {
      this.setState({ usersBid: 0 })
      return 0
    }); // user has not bidded
  }

  _startAuction = async () => {
    await startAuction()
    this._updateStage()
  }

  _placeBid = async (amt) => {
    await placeBid(amt.toString())
  }

  _collectTokens = async () => {
    await collectTokens()
    const hui = await checkNumOfTokens()
    const tokens = hui / (10 ** 18)
    alert(`You claimed ${tokens} tokens!`)
  }

  // FRONTEND FUNCTIONS
  setBid(e) {
    this.setState({ inputBid: e.target.value });
  }

  toggleTab(tab) {
    this.setState({ tab });
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
      if (_this.state.countingDown) {
        _this._updateTokensLeft()
        _this._updateTimeLeft()
        _this._updateUsersBid()
        _this.regularUpdate()
      }
    }, 1000)
  }

  // FUNCTION TO UPDATE ALL STATES
  updateStates() {
    this._updateStage()
    this._updateTokensLeft()
    this._updateUsersBid()
  }

  render() {
    return (
      <div className="container-fluid body">
        <div className="card">
          <div className="card-body">
            <h1 className="title">Dutch auction</h1>
            <div className="section-wrapper">
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
              <button className={`btn btn-secondary`} onClick={this._startAuction.bind(this)}>Start Auction</button>
              {/* ${this.state.stage !== "0" ? "disabled" : ""} */}
            </div>
            <div className="flex">
              <button className={`btn btn-half ${this.state.tab == 0 ? "active" : ""}`} onClick={this.toggleTab.bind(this, 0)}>Place Bid</button>
              <button className={`btn btn-half ${this.state.tab == 1 ? "active" : ""}`} onClick={this.toggleTab.bind(this, 1)}>My Bid</button>
            </div>

            <div className={`section-wrapper ${this.state.tab == 0 ? "" : "hide"}`}>
              <p>Place bid (in ETH)</p>
              <input className="form-control" type="number" min="1" placeholder="100" value={this.state.inputBid} onChange={this.setBid.bind(this)} ></input>
              <button className={`btn btn-secondary`} onClick={this.submitBid.bind(this)}>Submit bid</button>
              {/* ${this.state.stage !== "1" ? "disabled" : ""} */}
            </div>
            <div className={`section-wrapper ${this.state.tab == 1 ? "" : "hide"}`}>
              <p>Total bids: <span className="highlight bold">{this.state.usersBid} ETH</span></p>
              <p>Total potential minimum token: <span className="highlight bold">{(this.state.usersBid / this.state.currentTokenPrice).toFixed(0)} tokens</span></p>
              <button className={`btn btn-secondary`} onClick={this._collectTokens.bind(this)}>Claim tokens</button>
            </div>
            {/* ${this.state.stage !== "2" ? "disabled" : ""} */}
            {/* <a href="#" className="" onClick={this.updateStates.bind(this)}>Update State (only for debugging purposes)</a> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
