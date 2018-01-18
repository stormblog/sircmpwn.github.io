// I sincerely apologise for the garbage you're about to see

// This file is public domain, I guess. If you use this I would appreciate
// it if you linked back to my blog, but I ain't a cop.

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      provider: "fosspay",
      amount: "5.00",
      inMethod: "card-usd",
      inAmount: "100.00",
      frequency: "month",
      outMethod: "usd",
      patreonCreators: [
        { "id": 0, "username": "SirCmpwn", "amount": "5.00" }
      ]
    };
    this.renderFosspay = this.renderFosspay.bind(this);
    this.renderLiberapay = this.renderLiberapay.bind(this);
    this.renderPatreon = this.renderPatreon.bind(this);
  }

  renderFosspay() {
    const { amount } = this.state;
    let amt = parseFloat(amount);
    const stripe = amt * 0.029 + 0.30;
    const creator = amt - stripe;
    return (
      <div>
        <div class="form-group">
          <label for="amount">Amount</label>
          <div class="input-group">
            <span class="input-group-addon">$</span>
            <input
              type="text"
              class="form-control"
              aria-label="Amount"
              onChange={e => this.setState({ amount: e.target.value })}
              value={amount}
            />
            <span class="input-group-addon">per month</span>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th style={{ width: "12rem" }}>You pay</th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >${amt.toFixed(2)}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stripe fee</td>
              <td>2.9% + 30¢</td>
              <td
                style={{ textAlign: "right" }}
              >${stripe.toFixed(2)}</td>
              <td></td>
            </tr>
            <tr class="active">
              <th>Creator earns (pre-tax)</th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >${creator.toFixed(2)}</th>
              <td>per month</td>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >{(creator / amt * 100).toFixed(0)}%</th>
              <td>of your donation</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderLiberapay() {
    const { amount, inMethod, frequency, outMethod } = this.state;
    let amt = parseFloat(this.state.amount);
    let inAmount = parseFloat(this.state.inAmount);
    let inFee;
    switch (inMethod) {
      case "card-usd":
        inFee = inAmount * 0.02925 + 0.35;
        break;
      case "card-euro":
        inFee = inAmount * 0.02106 + 0.26;
        break;
      case "wire":
        inFee = inAmount *  0.00585;
        break;
      case "debit":
        inFee = 0.72;
        break;
    }
    let lpBalance = inAmount - inFee;
    const creator = amt;
    const outFee = ({
      "sepa": 0,
      "euro": 2.93,
      "usd": 3.51
    })[outMethod];
    const creatorOut = lpBalance - outFee;
    const duration = Math.floor(lpBalance / amt);
    const inTypes = {
      "card-usd": "Card",
      "card-euro": "Card",
      "wire": "Wire",
      "debit": "Debit",
    };
    const humanInFee = {
      "card-usd": "2.925%+35¢",
      "card-euro": "2.106%+€0.21",
      "wire": "0.585%",
      "debit": "€0.59",
    };
    return (
      <div>
        <p>
          If you transfer this amount into your Liberapay wallet:
        </p>
        <div class="form-group">
          <label for="amount">Amount</label>
          <div class="input-group">
            <span class="input-group-addon">$</span>
            <input
              type="text"
              class="form-control"
              aria-label="Amount"
              onChange={e => this.setState({ inAmount: e.target.value })}
              value={this.state.inAmount}
            />
          </div>
          <div style={{marginTop: "1rem"}}>
            <label>Transfer method</label>
          </div>
          <fieldset class="form-group">
            <label class="radio-inline">
              <input
                type="radio"
                name="inMethod"
                checked={inMethod === "card-usd"}
                onChange={e => this.setState({ inMethod: "card-usd" })}
              />
              Card - USD (2.925%+35¢)
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="inMethod"
                checked={inMethod === "card-euro"}
                onChange={e => this.setState({ inMethod: "card-euro" })}
              />
              Card - Euro (2.106%+€0.21)
            </label>
          </fieldset>
          <fieldset class="form-group">
            <label class="radio-inline">
              <input
                type="radio"
                name="inMethod"
                checked={inMethod === "wire"}
                onChange={e => this.setState({ inMethod: "wire" })}
              />
              Wire transfer (0.585%)
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="inMethod"
                checked={inMethod === "debit"}
                onChange={e => this.setState({ inMethod: "debit" })}
              />
              Direct debit - Euro (€0.59)
            </label>
          </fieldset>
        </div>
        <p>Your <strong>transaction fees</strong> will be:</p>
        <table class="table">
          <thead>
            <tr>
              <th style={{ width: "12rem" }}>You pay</th>
              <th></th>
              <th>${inAmount.toFixed(2)}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="active">
              <td>{inTypes[inMethod]} fee</td>
              <td>{humanInFee[inMethod]}</td>
              <td>(${inFee.toFixed(2)})</td>
            </tr>
            <tr>
              <td>Liberapay balance</td>
              <td></td>
              <td>${lpBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p>If you support your creators for this amount:</p>
        <div class="form-group">
          <label for="amount">Amount</label>
          <div class="input-group">
            <span class="input-group-addon">$</span>
            <input
              type="text"
              class="form-control"
              aria-label="Amount"
              onChange={e => this.setState({ amount: e.target.value })}
              value={amount}
            />
          </div>
        </div>
        <fieldset class="form-group" style={{ marginTop: "1rem" }}>
          <label class="radio-inline">
            <input
              type="radio"
              name="frequency"
              checked={frequency === "week"}
              onChange={e => this.setState({ frequency: "week" })}
            /> Per week
          </label>
          <label class="radio-inline">
            <input
              type="radio"
              name="frequency"
              checked={frequency === "month"}
              onChange={e => this.setState({ frequency: "month" })}
            /> Per month
          </label>
          <label class="radio-inline">
            <input
              type="radio"
              name="frequency"
              checked={frequency === "year"}
              onChange={e => this.setState({ frequency: "year" })}
            /> Per year
          </label>
        </fieldset>
        <p>
          Your creators earn <strong>${
            creator.toFixed(2)}</strong> per {
            frequency} for <strong>{duration} {frequency}(s)</strong>.
          If they wait until the end of this timeframe to withdraw their funds,
          their <strong>withdrawal fees</strong> will look like this:
        </p>
        <fieldset class="form-group" style={{ marginTop: "1rem" }}>
          <label class="radio-inline">
            <input
              type="radio"
              name="outMethod"
              checked={outMethod === "sepa"}
              onChange={e => this.setState({ outMethod: "sepa" })}
            />
            <a href="https://en.wikipedia.org/wiki/Single_Euro_Payments_Area">
              SEPA
            </a> (Europe): Free
          </label>
          <label class="radio-inline">
            <input
              type="radio"
              name="outMethod"
              checked={outMethod === "euro"}
              onChange={e => this.setState({ outMethod: "euro" })}
            /> Other Europe: €2.93
          </label>
          <label class="radio-inline">
            <input
              type="radio"
              name="outMethod"
              checked={outMethod === "usd"}
              onChange={e => this.setState({ outMethod: "usd" })}
            /> USD: $3.51
          </label>
        </fieldset>
        <table class="table">
          <thead>
            <tr>
              <th style={{ width: "12rem" }}>You pay</th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >${lpBalance.toFixed(2)}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Withdrawal fee</td>
              <td></td>
              <td
                style={{ textAlign: "right" }}
              >(${outFee.toFixed(2)})</td>
              <th></th>
            </tr>
            <tr class="active">
              <th>Creator earns (pre-tax)</th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >${creatorOut.toFixed(2)}</th>
              <td>
                over {duration} {frequency}(s)
              </td>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >{(creatorOut / inAmount * 100).toFixed(0)}%</th>
              <td>of your donation</td>
            </tr>
          </tbody>
        </table>
        <div class="alert alert-info">
          Fees in euros are for reference only. All amounts should be input in
          USD and all computed amounts are shown in USD based on the (probably
          dated) assumption that €1 EUR = $1.22 USD. Sorry.
        </div>
      </div>
    );
  }

  renderPatreon() {
    const creators = this.state.patreonCreators.sort(c => c.id);
    const total = creators.map(c => parseFloat(c.amount))
      .reduce((i, acc) => acc + i, 0);
    const tx_fee = total * 0.029 + 0.30;
    return (
      <div>
        {creators.map(creator =>
          <div key={creator.id}>
            <div class="form-group">
              <label for={`user-${creator.id}`}>Creator</label>
              <input
                id={`user-${creator.id}`}
                type="text"
                class="form-control"
                aria-label="Username"
                onChange={e => this.setState({
                  patreonCreators: [
                    { ...creator, username: e.target.value },
                    ...creators.filter(c => c.id != creator.id)
                  ]
                })}
                value={creator.username}
              />
            </div>
            <div class="form-group">
              <label for="amount">Amount</label>
              <div class="input-group">
                <span class="input-group-addon">$</span>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Amount"
                  onChange={e => this.setState({
                    patreonCreators: [
                      { ...creator, amount: e.target.value },
                      ...creators.filter(c => c.id != creator.id)
                    ]
                  })}
                  value={creator.amount}
                />
                <span class="input-group-addon">per month</span>
              </div>
            </div>
          </div>
        )}
        <div class="form-group">
          <button
            class="btn btn-default"
            onClick={e => {
              e.preventDefault();
              this.setState({
                patreonCreators: [
                  ...creators,
                  {
                    "id": Math.max(...creators.map(c => c.id)) + 1,
                    "username": "",
                    "amount": "5.00",
                  }
                ]
              });
            }}
          >Add another creator</button>
          {creators.length > 1 && <button
            class="btn btn-default"
            style={{marginLeft: "1rem"}}
            onClick={e => {
              e.preventDefault();
              this.setState({
                patreonCreators: creators.slice(0, -1)
              });
            }}
          >Remove a creator</button>}
        </div>
        <p>
          You only pay one <strong>transaction fee</strong> for all of your
          creators:
        </p>
        <table class="table">
          <thead>
            <tr>
              <th style={{ width: "12rem" }}>You pay</th>
              <th></th>
              <th
                style={{ textAlign: "right" }}
              >${total.toFixed(2)}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Transaction fee</td>
              <td>2.9% + 30¢</td>
              <td
                style={{ textAlign: "right" }}
              >(${tx_fee.toFixed(2)})</td>
              <td></td>
            </tr>
            <tr>
              <th></th>
              <th style={{textAlign: "right"}}>=</th>
              <th
                style={{ textAlign: "right" }}
              >${(total - tx_fee).toFixed(2)}</th>
              <th></th>
            </tr>
          </tbody>
        </table>
        <p>
          Your total minus the transaction fee is distributed to your creators
          like so:
        </p>
        <table class="table">
          <tbody>
            {creators.map(c => {
              const amt = parseFloat(c.amount);
              const share = (amt / total) * (total - tx_fee);
              const patreon_fee = share * 0.05;
              const after_patreon = share - patreon_fee;
              const clamp = (value, min, max) =>
                Math.min(Math.max(min, value), max);
              const withdrawl_fee = clamp(after_patreon * 0.01, 0.25, 20);
              const creator_total = after_patreon - withdrawl_fee;
              return [
                <tr class="active">
                  <th>{c.username}</th>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>,
                <tr>
                  <th>You pay</th>
                  <td></td>
                  <td
                    style={{textAlign: "right"}}
                  >${amt.toFixed(2)}</td>
                  <td></td>
                </tr>,
                <tr>
                  <td>Transaction fee</td>
                  <td>(see above)</td>
                  <td
                    style={{textAlign: "right"}}
                  >(${(amt - share).toFixed(2)})</td>
                  <td></td>
                </tr>,
                <tr>
                  <td>Patreon fee</td>
                  <td>5%</td>
                  <td
                    style={{ textAlign: "right" }}
                  >(${patreon_fee.toFixed(2)})</td>
                  <td></td>
                </tr>,
                <tr>
                  <td>Withdrawal fee*</td>
                  <td>1% (25¢ min, $20 max)</td>
                  <td
                    style={{ textAlign: "right" }}
                  >(${withdrawl_fee.toFixed(2)})</td>
                  <td></td>
                </tr>,
                <tr>
                  <th>Creator earns (pre-tax)</th>
                  <th></th>
                  <th
                    style={{ textAlign: "right" }}
                  >${creator_total.toFixed(2)}</th>
                  <td>per month</td>
                </tr>,
                <tr>
                  <th></th>
                  <th></th>
                  <th
                    style={{ textAlign: "right" }}
                  >{(creator_total / amt * 100).toFixed(0)}%</th>
                  <td>of your donation</td>
                </tr>
              ];
            })}
          </tbody>
        </table>
        <small>
          * Withdrawal fee assumes payout via PayPal. Numbers for payout via
          Stripe are not available, and numbers for Payoneer are different. <a
            href="https://patreon.zendesk.com/hc/en-us/articles/203913489-What-are-my-options-to-receive-payout-">Details here</a>.
          Withdrawal fees are also applied on the total sum of the creator's
          earnings, and capped at $20 across all earnings.
        </small>
      </div>
    );
  }

  render() {
    const { amount, provider } = this.state;
    return (
      <form class="calculator panel panel-default">
        <div class="panel-heading">
          Fee Calculator (based on 2018-01-16 fees)
        </div>
        <div class="panel-body">
          <div>
            {/* I know this is supposed to be a legend inside the fieldset */}
            <label>Platform</label>
          </div>
          <fieldset class="form-group">
            <label class="radio-inline">
              <input
                type="radio"
                name="platform"
                checked={provider === "fosspay"}
                onChange={e => this.setState({ provider: "fosspay" })}
              />
              fosspay
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="platform"
                checked={provider === "liberapay"}
                onChange={e => this.setState({ provider: "liberapay" })}
              />
              Liberapay
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="platform"
                checked={provider === "patreon"}
                onChange={e => this.setState({ provider: "patreon" })}
              />
              Patreon
            </label>
          </fieldset>
          {provider === "fosspay" && this.renderFosspay()}
          {provider === "liberapay" && this.renderLiberapay()}
          {provider === "patreon" && this.renderPatreon()}
        </div>
      </form>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("react-root"));
