import React from 'react';
import UserViews from './UserViews';

const exports = { ...UserViews };

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="Admin">
        <h2>Insurance (Admin)</h2>
        {content}
      </div>
    );
  }
}

exports.CreateProduct = class extends React.Component {
  render() {
    const { parent, defaultProduct, standardUnit } = this.props;
    const premium = (this.state || {}).premium || defaultProduct.premium;
    const cover = (this.state || {}).cover || defaultProduct.cover;
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-25">
              <label>Premium({standardUnit})</label>
            </div>
            <div className="col-75">
              <input
                type='number'
                placeholder={defaultProduct.premium}
                onChange={(e) => this.setState({ premium: e.currentTarget.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label>Cover({standardUnit})</label>
            </div>
            <div className="col-75">
              <input
                type='number'
                placeholder={defaultProduct.cover}
                onChange={(e) => this.setState({ cover: e.currentTarget.value })}
              />
            </div>
          </div>
          <div className="row">
            <button
              onClick={() => parent.createProduct({
                product: {
                  premium,
                  cover
                }
              })}
            >Create Product</button>
          </div>
        </div>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const { parent, product, standardUnit } = this.props;
    return (
      <div>
        Product (pay to deploy): <strong>{product.premium}</strong> {standardUnit}
        <br />
        <button
          onClick={() => parent.deploy()}
        >Deploy</button>
      </div>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.WaitingForClient = class extends React.Component {
  async copyToClipborad(button) {
    const { ctcInfoStr } = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const { ctcInfoStr } = this.props;
    return (
      <div>
        Waiting for Client to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipborad(e.currentTarget)}
        >Copy to clipboard</button>
      </div>
    )
  }
}

exports.ApproveOrDeclineClaim = class extends React.Component {
  render() {
    const { parent, playable, action } = this.props;
    return (
      <div>
        {action ? 'The client has claimed, please approve or decline the claim' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.takeAction('APRROVE')}
        >Approve Claim</button>
        <button
          disabled={!playable}
          onClick={() => parent.takeAction('DECLINE')}
        >Decline Claim</button>
      </div>
    );
  }
}

exports.ActivateCover = class extends React.Component {
  render() {
    const { parent, playable, action } = this.props;
    return (
      <div>
        {action ? 'Waiting...' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.takeAction('APRROVE')}
        >Activate Cover</button>
        <button
          disabled={!playable}
          onClick={() => parent.takeAction('WAIT')}
        >Wait</button>
        <button
          disabled={!playable}
          onClick={() => parent.takeAction('DECLINE')}
        >Cancel Cover</button>
      </div>
    );
  }
}

exports.WaitingForClientToTakeAction = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for claims from the clients...
      </div>
    );
  }
}

exports.WaitingForClaimActionToComplete = class extends React.Component {
  render() {
    const { action } = this.props;
    return (
      <div>
        <br />
        Waiting for claim {action === 'APRROVE' ? 'approval' : 'refusal'} to complete...
      </div>
    );
  }
}

export default exports;
