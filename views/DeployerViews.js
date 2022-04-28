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
        >Set wager</button>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const { parent, wager, standardUnit } = this.props;
    return (
      <div>
        Wager (pay to deploy): <strong>{wager}</strong> {standardUnit}
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

export default exports;