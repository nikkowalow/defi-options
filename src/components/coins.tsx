import React from 'react';
import * as config from '../configs/config.json';
import { Coin } from '../models/coin'

import { Link } from 'react-router-dom';

interface CoinsProps {
    onSelect: (coin: Coin) => void;
}

interface CoinsState {
    coins: { [id: number]: Coin };
}

export class Coins extends React.Component<CoinsProps, CoinsState> {
    constructor(props) {
        super(props)
        this.state = {
            coins: [] as Coin[],
        }

        this.displayCoins = this.displayCoins.bind(this)
    }

    componentDidMount() {
        this.displayCoins();
    }

    displayCoins() {
        const qs = '?id=' + Object.values(config.CMC.coinIDs).join(',')
        const requestOptions = {
            method: "GET",
            headers: new Headers({
                "X-CMC_PRO_API_KEY": config.CMC.apiKey
            })
        };

        fetch(config.CMC.URL.info + qs, requestOptions)
            .then(response => response.json()).then(response => response.data).then(response => {
                let coins: Coin[] = [] as Coin[];
                Object.keys(response).forEach(key => {
                    console.log(response)
                    coins.push(Coin.parse(response[key]));
                });
                this.setState({ coins: coins })
            }).catch((err: any) => {
                console.log("API Call Error:", err.message);
            });
    }

    icons() {
        return Object.values(this.state.coins).map(coin =>
            <Link to="/options">
                <img src={coin.logo} alt={coin.logo} onClick={() => this.props.onSelect(coin)} className="coin-icon" />
            </Link>
        );
    }

    render() {
        return (
            <div className="coin-icons">
                {this.icons()}
            </div>
        );
    }
}

