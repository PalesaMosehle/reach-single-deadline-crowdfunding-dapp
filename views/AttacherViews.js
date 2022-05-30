import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Contributor)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.AcceptTerms = class extends React.Component {
  render() {
    const {wager, projectNameAtomic, projectDescriptionAtomic, standardUnit, parent} = this.props;
    const contribution = wager;
    const {disabled} = this.state || {};
    console.log(projectNameAtomic);
    let result = projectNameAtomic.toString('base64');
    // const premium = (this.state || {}).premium || defaultProduct.premium;
    return (
      <div>
        Project Name: {result.trim()}
        <br />
        Project Description: {projectDescriptionAtomic}
        <br />
        The Terms and Conditions of the project are:
        <br /> Required Funding Amount: {wager} {standardUnit}
        <br /> Funds will be send back to the contributors if it doesn't reach : {wager} {standardUnit}
        <br /> 
        <br />
        <br />
        <div className="row">
            <div className="col-25">
              <label>Contribution Amount:({standardUnit})</label>
            </div>
            <div className="col-75">
              <input
                type='number'
                placeholder={contribution}
                onChange={(e) => this.setState({ contribution: e.currentTarget.value })}
              />
            </div>
        </div>
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.termsAccepted(contribution);
          }}
        >Accept terms and pay contribution</button>
      </div>
    );
  }
}

exports.WaitingForTurn = class extends React.Component {
  render() {
    return (
      <div>
        Waiting the FundRaiser...
        <br />The project funding can be accepted of refunded bbased on terms of the fund.
      </div>
    );
  }
}

export default exports;