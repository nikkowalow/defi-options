import { HashRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { WalletProvider } from "./models/wallet";
import { ConnectionProvider } from "./models/connection";
import { ConnectButton } from './components/connectButton';


export function Routes() {
    return (
        <>
            <HashRouter basename={"/"}>
                <ConnectionProvider>
                    <WalletProvider>
                        <Switch>

                        </Switch>
                    </WalletProvider>
                </ConnectionProvider>
            </HashRouter>
        </>
    );
}
