import React from 'react';
import { Coin } from '../models/coin'
import { Table } from '.';
interface OptionChainProps {
    coin: Coin;
}

interface OptionChainState {
    price: number,
    volume: number,
    marketCap: number
}

export class OptionChain extends React.Component<OptionChainProps, OptionChainState> {
    constructor(props) {
        super(props)

        this.state = {
            price: 0,
            volume: 0,
            marketCap: 0
        }
        this.updateQuote = this.updateQuote.bind(this)
    }
    componentDidMount() {
        this.props.coin?.quote(this.updateQuote);
    }

    updateQuote(status: boolean) {
        if (status) {
            this.setState({
                price: this.props.coin?.price
            });
        }
    }

    render() {
        const table = (this.state.price) ? <Table coin={this.props.coin} /> : null;
        return (
            <div className="options-container">
                <h2 className="options-header">
                    {this.props.coin?.name} ({this.props.coin?.symbol})
                    <img src={this.props.coin?.logo} className="coin-icon" />
                    ${this.state.price}
                </h2>
                {table}
                <button style={{ width: 235 }} className="button">
                    Create your own option
                </button>
            </div >
        );
    }
}

