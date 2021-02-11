import React from 'react';
import {Coin} from '../models/coin'
import { Option } from '.'

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
        console.log(this.props)
        console.log(this.props.coin)
        console.log(`coinName from -options.tsx: ${this.props.coin?.name}`);
        this.props.coin.quote(this.updateQuote);
    }

    updateQuote(status: boolean) {
        if (status) {
            this.setState({
                price: this.props.coin.price
            });
        }
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
            </div >
        );
    }
}

