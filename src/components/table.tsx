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

    data: {} = {};
    instrument: {} = {};

    state = {
        calls: [],
        puts: []
    }


    componentDidMount() {
        this.fillTable();
    }

    async fillTable() {
        await this.getOptionChain();
        if (!this.data)
            return;
        let calls: OptionType[] = [];
        let puts: OptionType[] = [];
        const length = Object.getOwnPropertyNames(this.data).length;
        for (let i = 0; i < length / 40; i++) {
            const instrumentID = this.data[i].instrument_name;
            await this.getOptionInfo(instrumentID);
            let info = this.data[i];
            if (instrumentID.split('-')[3] == 'C') {
                calls.push({
                    instrumentID: info.instrument_name,
                    strike: instrumentID.split('-')[2],
                    bid: info.bid_price,
                    ask: info.ask_price,
                    delta: this.instrument['greeks'].delta,
                    gamma: this.instrument['greeks'].gamma,
                    theta: this.instrument['greeks'].theta,
                    rho: this.instrument['greeks'].rho,
                    vega: this.instrument['greeks'].vega,
                    percentChange: "14%",
                    expirationDate: instrumentID.split('-')[1]
                });
            } else {
                puts.push({
                    instrumentID: info.instrument_name,
                    strike: instrumentID.split('-')[2],
                    bid: info.bid_price,
                    ask: info.ask_price,
                    delta: this.instrument['greeks'].delta,
                    gamma: this.instrument['greeks'].gamma,
                    theta: this.instrument['greeks'].theta,
                    rho: this.instrument['greeks'].rho,
                    vega: this.instrument['greeks'].vega,
                    percentChange: "14%",
                    expirationDate: instrumentID.split('-')[1]
                });
            }
        }
        this.setState({ calls });
        this.setState({ puts });
    }

    getOptionInfo = async (instrumentName: string) => {
        const requestOptions = {
            method: 'GET',
            uri: "https://test.deribit.com/api/v2/public/ticker?instrument_name=" + instrumentName,
            "jsonrpc": "2.0",
            json: true
        };
        await rp(requestOptions)
            .then((response) => {
                this.instrument = response['result'];
            }).catch((err) => {
                console.log("API call error getOptionInfo():", err.message);
            });
    }

    async getOptionChain() {
        const requestOptions = {
            method: 'GET',
            uri: "https://test.deribit.com/api/v2/public/get_book_summary_by_currency?currency=" + this.props.coin?.symbol + "&kind=option",
            "jsonrpc": "2.0",
            json: true
        };
        await rp(requestOptions)
            .then((response) => {
                this.data = response['result'];
            }).catch((err) => {
                console.log("API call error getOptionChain():", err.message);
            });
    }


    renderOption = (option: any, index: any) => {
        console.log('current option' + option);
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
