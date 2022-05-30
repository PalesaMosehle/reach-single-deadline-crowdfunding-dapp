import React from 'react';
import PlayerViews from './PlayerViews';

const exports = { ...PlayerViews };

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="Deployer">
        <h2>Deployer (FundRaiser)</h2>
        {content}
      </div>
    );
  }
}

exports.SetWager = class extends React.Component {
  render() {
    const { parent, defaultWager, standardUnit } = this.props;
    console.log(parent);
    const wager = (this.state || {}).wager || defaultWager.contributionAmount;
    const projectName = (this.state || {}).projectName || defaultWager.projectName;
    const projectDescription = (this.state || {}).projectDescription || defaultWager.projectDescription;
    return (
      <div>
        <input
          type='text'
          placeholder={projectName}
          onChange={(e) => this.setState({ projectName: e.currentTarget.value })}
        />
        <br />
        <input
          type='text'
          placeholder={projectDescription}
          onChange={(e) => this.setState({ projectDescription: e.currentTarget.value })}
        />
        <br />
        <input
          type='number'
          placeholder={wager}
          onChange={(e) => this.setState({ wager: e.currentTarget.value })}
        /> {standardUnit}
        <br />
        <button
          onClick={() => parent.setWager({
            project: {
              projectName,
              projectDescription,
              wager,
            }
          })}
        >Confirm Project Details</button>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const { parent, project, standardUnit } = this.props;
    return (
      <div>
        Project Name: <strong>{project.projectName}</strong> 
        <br />
        Project Description: <strong>{project.projectDescription}</strong>
        <br />
        Minimum Contribution: <strong>{project.wager}</strong> {standardUnit}
        <br />
        <button
          onClick={() => parent.deploy()}
        >Create FundRaising</button>
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

exports.WaitingForAttacher = class extends React.Component {
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
        Waiting for Attacher to join...
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

// Player views must be extended.
// It does not have its own Wrapper view.

exports.CloseOrRefund = class extends React.Component {
  render() {
    const {parent, playable, hand} = this.props;
    return (
      <div>
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.playHand('ROCK')}
        >Close FundRaising</button>
        <br />
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.playHand('SCISSORS')}
        >Refund Contributions</button>
      </div>
    );
  }
}

export default exports;