import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="App">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <div className="topnav">
          <a href="#home">Inurance Dapp</a>
        </div>
        <header className="App-header" id="root">
          {content}
        </header>
      </div>
    );
  }
}

exports.ConnectAccount = class extends React.Component {
  render() {
    return (
      <div>
        Please wait while we connect to your account.
        If this takes more than a few seconds, there may be something wrong.
      </div>
    )
  }
}

exports.FundAccount = class extends React.Component {
  render() {
    const { bal, standardUnit, defaultFundAmt, parent } = this.props;
    const amt = (this.state || {}).amt || defaultFundAmt;
    return (
      <div>
        <ul className="breadcrumb">
          <li>Fund account</li>
        </ul>
        <br />
        <div className="balance">Balance: {bal} {standardUnit}</div>
        <hr />
        Would you like to fund your account with additional {standardUnit}?
        <br />
        (This only works on certain devnets)
        <br />
        <div className="container">
            <div className="row">
              <div className="col-25">
                <label>Amount({standardUnit})</label>
              </div>
              <div className="col-75">
                <input
                  type='number'
                  placeholder={defaultFundAmt}
                  onChange={(e) => this.setState({ amt: e.currentTarget.value })}
                />
              </div>
            </div>
            <div className="row">
              <button onClick={() => parent.fundAccount(amt)}>Fund Account</button>
              <button onClick={() => parent.skipFundAccount()}>Skip</button>
            </div>
        </div>
      </div>
    );
  }
}

exports.AdminOrClient = class extends React.Component {
  render() {
    const { parent } = this.props;
    return (
      <div>
        <ul className="breadcrumb">
          <li>Please select a role:</li>
        </ul>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-100">
              <label>Create the product and deploy the contract.</label>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <button onClick={() => parent.selectAdmin()}>Admin</button>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
            <div className="row">
              <div className="col-100">
                <label>Attach to the Insurance's contract.</label>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <button onClick={() => parent.selectClient()}>Client</button>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default exports;
