import React, { useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { NavigationBar, Coins, ConnectWallet, ConnectButton, DisconnectButton, OptionChain, CoinInfo } from '.';
import { connect } from '../solanaHelperMethods';
import { StatsModel } from '../statsModel';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { throws } from 'assert';
import mountains from "../images/mountains.jpg";
import beach from "../images/beach.jpg";

interface MainViewState {
    model: StatsModel;
    authenticated: boolean;
    yourKey: PublicKey;
    programId: PublicKey;
    balance: number;
    images: string[];
    coin: CoinInfo;
    publicKey: PublicKey;
}

export class MainView extends React.Component<any, MainViewState> {

    state = {
        authenticated: false,
        images: [mountains, beach],

    } as MainViewState;



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

    onCoinSelect = (coin: CoinInfo) => {
        console.log(`COIN: ${coin.name}`);
        this.setState({ coin: coin });
    }

    render() {


        const button = this.state.authenticated ? <DisconnectButton connect={this.connect} /> : <ConnectButton />;
        return (
            <div className="main-view">
                <Router>
                    <NavigationBar authenticated={this.state.authenticated} />
                    {button}
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
                        {/* <PrivateRoute isConnected={this.state.authenticated} path="/voting" component={<Voting model={this.model} voterKey={this.state.publicKey} />} /> */}
                    </Switch>
                </Router>
            </div >
        );
    }
}

