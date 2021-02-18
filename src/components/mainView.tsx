import React, { useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { NavigationBar, Coins, Stats, ConnectWallet, ConnectButton, DisconnectButton, OptionChain } from '.';
import { Coin } from '../models/coin'
import { connect } from '../solanaHelperMethods';
import { StatsModel } from '../statsModel';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { throws } from 'assert';
import mountains from "../images/mountains.jpg";
import beach from "../images/beach.jpg";
import solanalogo from '../images/solanalogo.png';
import { ConnectionProvider } from '../models/connection';
import { WalletProvider } from '../models/wallet';

interface MainViewState {
    model: StatsModel;
    authenticated: boolean;
    yourKey: PublicKey;
    programId: PublicKey;
    balance: number;
    images: string[];
    coin: Coin;
    publicKey: PublicKey;
}

export class MainView extends React.Component<any, MainViewState> {
    constructor(props) {
        super(props)

        this.state = {
            authenticated: false,
            images: [mountains, beach],

        } as MainViewState;
    }


    async componentDidMount() {
        await connect();
    }

    model = new StatsModel;
    onSubmit = async (key: string, status: boolean) => {
        const balance = await this.model.getBalance(new PublicKey(key));
        this.setState({
            authenticated: status,
            yourKey: new PublicKey(key),
            balance: balance / LAMPORTS_PER_SOL
        });
    }

    connect = async (status: boolean) => {
        this.setState({ authenticated: status });
    }

    onCoinSelect = (coin: Coin) => {
        console.log(`COIN: ${coin.name}`);
        this.setState({ coin: coin });
    }

    render() {
        const menu = this.state.authenticated ? <Stats voterKey={this.state.yourKey} model={this.model} balance={this.state.balance} />
            : null;
        return (
            <div className="main-view">
                {menu}
                <Router>
                    <NavigationBar authenticated={this.state.authenticated} />

                    <ConnectionProvider>
                        <WalletProvider>
                            <ConnectButton />
                            <Switch>
                                <Route path="/connect">
                                    <ConnectWallet onSubmit={this.onSubmit} />
                                </Route>
                                <Route path="/coins">
                                    <Coins onSelect={this.onCoinSelect} />
                                </Route>
                                <Route path="/options">
                                    <OptionChain coin={this.state.coin} />
                                </Route>
                            </Switch>
                        </WalletProvider >
                    </ConnectionProvider >

                    <div className="watermark">
                        <span className="watermark-phrase">powered by</span>
                        <img className="watermark-logo" src={solanalogo} />
                    </div>
                </Router >
            </div >
        );
    }
}

