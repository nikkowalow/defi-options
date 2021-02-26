import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { NavigationBar, Coins, Faucet, ConnectButton, OptionChain } from '.';
import { Coin } from '../models/coin'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import solanalogo from '../images/solanalogo.png';
import { ConnectionProvider } from '../models/connection';
import { WalletProvider } from '../models/wallet';
import * as button from '../configs/buttons.json';

interface MainViewState {
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
        } as MainViewState;
    }





    connect = async (status: boolean) => {
        this.setState({ authenticated: status });
    }

    onCoinSelect = (coin: Coin) => {
        console.log(`COIN: ${coin.name}`);
        this.setState({ coin: coin });
    }

    render() {
        return (
            <div className="main-view">
                <Router>
                    <NavigationBar authenticated={this.state.authenticated} />
                    <ConnectionProvider>
                        <WalletProvider>
                            <ConnectButton type={button.type.CONNECTION} />
                            <ConnectButton type={button.type.FAUCET} />

                            <Switch>
                                <Route path="/coins">
                                    <Coins onSelect={this.onCoinSelect} />
                                </Route>
                                <Route path="/options">
                                    <OptionChain coin={this.state.coin} />
                                </Route>
                                <Route>
                                    <Faucet />
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

