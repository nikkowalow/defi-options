import React from 'react';
import rp from 'request-promise';
import * as config from '../configs/config.json';

import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

export interface CoinInfo {
    id: string;
    logo: string;
    name: string;
    symbol: string;
    description: string;
}

interface CoinsProps {
    onSelect: (coin: CoinInfo) => void;
}

export interface CoinsState {
    coins: { [id: number]: CoinInfo };
}
export class Coins extends React.Component<CoinsProps, CoinsState> {


    state = {
        coins: [] as CoinInfo[],
    }

    componentDidMount() {
        this.displayCoins();
    }

    displayCoins = () => {

        const IDs = Object.values(config.CMC.coinIDs).join(',')
        const requestOptions = {
            method: "GET",
            uri: config.CMC.URL.info,
            qs: {
                id: IDs,
            },
            headers: {
                "X-CMC_PRO_API_KEY": config.CMC.apiKey
            },
            json: true,
            gzip: true,
        };

        rp(requestOptions)
            .then((response: { data: { [id: number]: CoinInfo } }) => {
                this.setState({ coins: response.data });
                console.log("API call response:", Object.keys(response.data).length);

            }).catch((err: any) => {
                console.log("API call error:", err.message);
            });
    }


    icons() {
        return Object.values(this.state.coins).map(coin =>
            <Link to="/options">
                <img src={coin.logo} onClick={() => this.props.onSelect(coin)} className="coinLogo" />
            </Link>
        );
    }

    render() {
        return (
            <div>
                {/* <button className="button" onClick={this.displayCoins}>
                    Display coins
                </button>
                <button className="button" onClick={this.displayInfo}>
                    Display info
                </button> */}
                <div>
                    {this.icons()}
                </div>

            </div>
        );
    }
}

