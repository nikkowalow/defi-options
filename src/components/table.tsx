import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import * as style from '../configs/style.json';
import { Coin } from '../models/coin';
var rp = require('request-promise');

var greeks = require('greeks');

interface TableProps {
    coin?: Coin;
}

interface TableState {
    calls: OptionType[];
    puts: OptionType[];
}

interface OptionType {

}

export class Table extends React.Component<TableProps, TableState> {

    state = {
        calls: [],
        puts: []
    }


    componentDidMount() {
        this.fillTable();
    }

    async fillTable() {
        await this.props.coin?.getOptionChain();
        if (!this.props.coin?.data)
            return;
        let calls: OptionType[] = [];
        let puts: OptionType[] = [];
        const length = Object.getOwnPropertyNames(this.props.coin?.data).length;
        for (let i = 0; i < length / 40; i++) {
            const instrumentID = this.props.coin?.data[i].instrument_name;
            await this.props.coin?.getOptionInfo(instrumentID);
            let info = this.props.coin?.data[i];
            if (instrumentID.split('-')[3] == 'C') {
                calls.push({
                    instrumentID: info.instrument_name,
                    strike: instrumentID.split('-')[2],
                    bid: info.bid_price,
                    ask: info.ask_price,
                    delta: this.props.coin?.instrument['greeks'].delta,
                    gamma: this.props.coin?.instrument['greeks'].gamma,
                    theta: this.props.coin?.instrument['greeks'].theta,
                    rho: this.props.coin?.instrument['greeks'].rho,
                    vega: this.props.coin?.instrument['greeks'].vega,
                    percentChange: "14%",
                    expirationDate: instrumentID.split('-')[1]
                });
            } else {
                puts.push({
                    instrumentID: info.instrument_name,
                    strike: instrumentID.split('-')[2],
                    bid: info.bid_price,
                    ask: info.ask_price,
                    delta: this.props.coin?.instrument['greeks'].delta,
                    gamma: this.props.coin?.instrument['greeks'].gamma,
                    theta: this.props.coin?.instrument['greeks'].theta,
                    rho: this.props.coin?.instrument['greeks'].rho,
                    vega: this.props.coin?.instrument['greeks'].vega,
                    percentChange: "14%",
                    expirationDate: instrumentID.split('-')[1]
                });
            }
        }
        this.setState({ calls });
        this.setState({ puts });
    }

    renderOption = (option: any, index: any) => {
        return (

            <tr key={index} >
                <td>{option.instrumentID}</td>
                <td>{option.strike}</td>
                <td>{option.bid}</td>
                <td>{option.ask}</td>
                <td>{option.delta}</td>
                <td>{option.gamma}</td>
                <td>{option.theta}</td>
                <td>{option.rho}</td>
                <td>{option.vega}</td>
                <td>{option.expirationDate}</td>
                <td>
                    <div className="buy-sell-buttons">
                        <button className="buy-button">BUY</button>
                        <button className="sell-button">SELL</button>
                    </div>

                </td>
            </tr>

        );
    }

    render() {
        return (
            <div className="table">
                <thead>
                    <tr className="table-body">
                        <th>Instrument ID</th>
                        <th>Strike</th>
                        <th>Bid</th>
                        <th>Ask</th>
                        <th>Delta {style.greeks.delta}</th>
                        <th>Gamma {style.greeks.gamma}</th>
                        <th>Theta {style.greeks.theta}</th>
                        <th>Rho {style.greeks.rho}</th>
                        <th>Vega {style.greeks.vega}</th>
                        <th>Exp. Date</th>
                        <th>Buy/Sell</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {this.state.calls.map(this.renderOption)}
                    {this.state.puts.map(this.renderOption)}
                </tbody>
            </div>
        );
    }
}
