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
    this._updateStage()
    // TO-DO - IF STARTED, UPDATE STATE

    // TO-DO - WATCH FOR EMITS (E.G. ENDING ETC.)
    // let event = contractInstance.event()
    // event.watch(callback)
  }

  // FUNCTION TO GET STAGE
  _updateStage = async () => {
    let stage = await getStage()
    console.log({stage})
    this.setState({ stage })
  }
  // FUNCTION TO GET TIME LEFT
  _updateTimeLeft = async () => {
    let timeLeft = await getTimeLeft();
    this.setState({ timeLeft })
  }
  // FUNCTION TO GET TOKENS LEFT
  _updateTokensLeft = async () => {
    let tokensLeft = await getTokensLeft();
    this.setState({ tokensLeft })
  }
  // FUNCTION TO GET CURRENT TOKEN PRICE
  _updateCurrentTokenPrice = async () => {
    let currentTokenPrice = await getCurrentTokenPrice();
    this.setState({ currentTokenPrice })
  }



  // TO-DO - START AUCTION
  _startAuction = async () => {
    let start = await startAuction()
    // this.setState({ stage })
  }
  // TO-DO - PLACE BID
  _placeBid = async () => {
    let placeBidResult = await placeBid()
    // this.setState({ stage })
  }



  // FRONTEND FUNCTIONS
  setBid(e) {
    this.setState({ inputBid: e.target.value });
  }

  submitBid(e) {
    const bid = Number(this.state.inputBid)
    if(bid <= 0) {
      alert('Bid cannot be zero or less')
      return
    }
    // TODO - FUNCTION TO CALL CONTRACT TO BUY TOKENS
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
          </div>
        </div>
      </div>
    );
  }
}

export default App;
