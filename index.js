import React from 'react';
import AppViews from './views/AppViews';
import AdminViews from './views/AdminViews';
import ClientViews from './views/ClientViews';
import { renderDOM, renderView } from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
import { ALGO_WalletConnect as WalletConnect } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);
reach.setWalletFallback(reach.walletFallback({providerEnv: 'TestNet', MyAlgoConnect }));
// reach.setWalletFallback(reach.walletFallback({ providerEnv: 'TestNet', WalletConnect }));
// reach.setWalletFallback(reach.walletFallback({}));

const actionToInt = { 'APRROVE': 0, 'WAIT': 1, 'DECLINE': 2 };
const intToOutcome = ['The claim has been approved', 'Claim Hanging!', 'The cover/claim was declined'];
const { standardUnit } = reach;
const defaults = {
  defaultFundAmt: '10',
  defaultProduct: {
    premium: 100,
    cover: 15000
  },
  standardUnit
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: 'ConnectAccount', ...defaults };
  }
  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({ acc, bal });
    if (await reach.canFundFromFaucet()) {
      this.setState({ view: 'FundAccount' });
    } else {
      this.setState({ view: 'AdminOrClient' });
    }
  }
  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({ view: 'AdminOrClient' });
  }
  async skipFundAccount() {
    this.setState({ view: 'AdminOrClient' });
  }
  selectClient() { this.setState({ view: 'Wrapper', ContentView: Client }); }
  selectAdmin() { this.setState({ view: 'Wrapper', ContentView: Admin }); }
  render() { return renderView(this, AppViews); }
}

class User extends React.Component {
  random() { return reach.hasRandom.random(); }
  seeOutcome(i) { this.setState({ view: 'Done', outcome: intToOutcome[i] }); }
  informTimeout() { this.setState({ view: 'Timeout' }); }
  takeAction(action) { this.state.resolveActionP(action); }
}

class Admin extends User {
  constructor(props) {
    super(props);
    this.state = { view: 'CreateProduct' };
  }
  createProduct(product) {
    this.setState({ view: 'Deploy', ...product });
  }
  async deploy() {
    // const ctc = this.props.acc.deploy(backend);
    const ctc = this.props.acc.contract(backend);
    this.setState({ view: 'Deploying', ctc });
    this.product = this.state.product; // UInt
    this.product.premium = reach.parseCurrency(this.product.premium)
    this.product.cover = reach.parseCurrency(this.product.cover)
    this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
    backend.Admin(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({ view: 'WaitingForClient', ctcInfoStr });
  }

  async activateCover() { // Fun([], UInt)
    const action = await new Promise(resolveActionP => {
      this.setState({ view: 'ActivateCover', playable: true, resolveActionP });
    });
    this.setState({ view: 'WaitingForClientToTakeAction', action });
    return actionToInt[action];
  }

  async approveOrDeclineClaim() { // Fun([], UInt)
    const action = await new Promise(resolveActionP => {
      this.setState({ view: 'ApproveOrDeclineClaim', playable: true, resolveActionP });
    });
    this.setState({ view: 'WaitingForClaimActionToComplete', action });
    return actionToInt[action];
  }

  render() { return renderView(this, AdminViews); }
}

class Client extends User {
  constructor(props) {
    super(props);
    this.state = { view: 'Attach' };
  }
  attach(ctcInfoStr) {
    // const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({ view: 'Attaching' });
    backend.Client(ctc, this);
  }
  async acceptAndBuyProduct(premiumAtomic, coverAtomic) { // Fun([UInt], Null)
    const premium = reach.formatCurrency(premiumAtomic, 4);
    const cover = reach.formatCurrency(coverAtomic, 4);
    return await new Promise(resolveAcceptedP => {
      this.setState({ view: 'AcceptTerms', premium, cover,resolveAcceptedP });
    });
  }
  termsAccepted() {
    this.state.resolveAcceptedP();
    this.setState({ view: 'WaitingForInurance' });
  }

  async claim() { // Fun([], UInt)
    const action = await new Promise(resolveActionP => {
      this.setState({ view: 'Claim', playable: true, resolveActionP });
    });
    this.setState({ view: 'WaitingForClaimOutcome', action });
    return actionToInt[action];
  }

  render() { return renderView(this, ClientViews); }
}

renderDOM(<App />);
