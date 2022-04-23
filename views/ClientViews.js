import React from 'react';
import UserViews from './UserViews';

const exports = {...UserViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Client">
        <h2>Subscriber(Client)</h2>
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
    const {premium, cover, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    return (
      <div>
        Insurance terms and conditions are:
        <br /> Premium: {premium} {standardUnit}
        <br /> Cover: {cover} {standardUnit}
        <br />
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.termsAccepted();
          }}
        >Accept terms and pay product</button>
      </div>
    );
  }
}

exports.WaitingForInurance = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for Insurance(Admin) to activate the cover...
        <br />Once the cover has been activated, you will be able to claim
      </div>
    );
  }
}

exports.Claim = class extends React.Component {
  render() {
    const { parent, playable} = this.props;
      return (
        <div>
          <div>
            Your cover is active
            <br />You can Claim Now
          </div>
          <br />
          {!playable ? 'Please wait...' : ''}
          <br />
          <button
          disabled={!playable}
          onClick={() => parent.takeAction('WAIT')}
        >Claim</button>
        </div>
      );

  }
}

exports.WaitingForClaimOutcome = class extends React.Component {
  render() {
    return (
      <div>
        The claim was submitted successfully...
        <br/> Please wait for the outcome 
      </div>
    );
  }
}

export default exports;
