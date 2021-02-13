import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import * as style from '../configs/style.json';


var greeks = require('greeks');

interface TableProps {
    underlyingPrice: number;
}

interface TableState {
    options: OptionType[]; // todo: use type
}

interface OptionType {

}

export class Table extends React.Component<TableProps, TableState> {

    minStrike: number = 0;
    maxStrike: number = 0;
    strikeInterval: number = 0;

    state = {
        options: []
    }


    componentDidMount() {
        this.fillTable();
    }

    fillTable() {
        this.setStrikeBounds();
        this.setInterval();
        let options: OptionType[] = [];
        for (let i = this.minStrike; i < this.maxStrike; i += this.strikeInterval) {
            let strike = Math.round(i * 100) / 100;
            options.push({
                strike: strike, lastPrice: 100, bid: 0.77, ask: 0.79, premium: 55, delta: "0.63",
                gamma: "0.92", theta: "0.22", rho: "0.47", vega: "0.99", change: "231", percentChange: "14%"
            });
        }
        this.setState({ options });
    }

    setInterval() {
        this.strikeInterval = (this.props.underlyingPrice / 10);
    }

    setStrikeBounds() {
        this.minStrike = this.props.underlyingPrice / 2;
        this.maxStrike = this.props.underlyingPrice + this.minStrike;
    }




    renderOption = (option: any, index: any) => {
        console.log('current option' + option);
        return (

            <tr key={index} >
                <td>{option.strike}</td>
                <td>{option.bid}</td>
                <td>{option.ask}</td>
                <td>{option.premium}</td>
                <td>{option.lastPrice}</td>
                <td>{option.delta}</td>
                <td>{option.gamma}</td>
                <td>{option.theta}</td>
                <td>{option.rho}</td>
                <td>{option.vega}</td>
                <td>{option.change}</td>
                <td>{option.percentChange}</td>
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
        console.log(`price: ${this.props.underlyingPrice}`);
        return (
            <div className="table">
                <thead>
                    <tr className="table-body">
                        <th>Strike</th>
                        <th>Bid</th>
                        <th>Ask</th>
                        <th>Premium</th>
                        <th>Last Price</th>
                        <th>Delta {style.greeks.delta}</th>
                        <th>Gamma {style.greeks.gamma}</th>
                        <th>Theta {style.greeks.theta}</th>
                        <th>Rho {style.greeks.rho}</th>
                        <th>Vega {style.greeks.vega}</th>
                        <th>Change</th>
                        <th>% Change</th>
                        <th>Execute</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {this.state.options.map(this.renderOption)}
                </tbody>
            </div>
        );
    }
}
