import React from 'react';
import rp from 'request-promise';
import * as config from '../configs/config.json';
import { useTable } from 'react-table';
import { CoinInfo, CoinsState } from './coins'
import { Option } from '.'

import { Link } from 'react-router-dom';
import { throws } from 'assert';
import { timeStamp } from 'console';

interface OptionChainProps {
    coin?: CoinInfo;
}




export class OptionChain extends React.Component<OptionChainProps> {


    state = {
        price: 0,
        volume: 0,
        marketCap: 0
    }

    componentDidMount() {
        console.log(`coinName from -options.tsx: ${this.props.coin?.name}`);
        this.getQuote();
    }

    getQuote = () => {
        const requestOptions = {
            method: 'GET',
            uri: config.CMC.URL.quote,
            qs: {
                id: this.props.coin?.id,
                // convert: config.CMC.currencyConversion
            },
            headers: {
                "X-CMC_PRO_API_KEY": config.CMC.apiKey
            },
            json: true,
            gzip: true,
        };
        rp(requestOptions)
            .then((response) => {
                if (this.props.coin) {
                    this.setState({
                        price: Math.round(response.data[this.props.coin?.id.toString()].quote.USD.price * 100) / 100
                    });
                    console.log(`quote: ${this.state.price}`);
                    console.log("API call response:", response.data[this.props.coin?.id.toString()]);
                }
            }).catch((err: any) => {
                console.log("API call error:", err.message);
            });
    }


    makeOptionsChain() {
        return (
            <Option coin={this.props.coin} />
        );
    }


    render() {
        return (
            <div className="options-container">

                <h2 className="options-header">
                    {this.props.coin?.name} ({this.props.coin?.symbol})
                    <img src={this.props.coin?.logo} className="coinLogo" />
                    ${this.state.price}
                </h2>
                {this.makeOptionsChain()}


                <button className="button" onClick={this.makeOptionsChain}>
                    view
                </button>
                {/* <div className="description">
                    {this.props.coin?.description}
                </div> */}
                {/* <img src={this.state.coin.data} /> */}
            </div >
        );
    }
}

