import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";
import { useWallet } from "../models/wallet";
import { useConnection } from '../models/connection';
import { Account, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as button from '../configs/buttons.json';

export interface ConnectButtonProps {
    type: String;
}

export const ConnectButton = (props: ConnectButtonProps) => {
    const { connected, connect, provider, disconnect } = useWallet();
    const connection = useConnection();
    const { publicKey } = useWallet();

    const airdrop = () => {
        if (publicKey) connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
    }



    if (!provider && props.type == button.type.CONNECTION) {
        if (!connected) {
            return (
                <Button
                    className="connect-button"
                    onClick={connect}
                >
                    connect
                </Button>
            );
        } else {
            return (
                <Button
                    className="disconnect-button"
                    onClick={disconnect}
                >
                    disconnect
                </Button>
            );
        }
    }
    if (connected && props.type == button.type.FAUCET) {
        return (
            <Button
                className="button"
                onClick={airdrop}
            >
                Faucet SOL
            </Button>
        );
    }

    if (props.type == button.type.MINT) {
        return (
            <Button
                className="button"
            // onClick={mintToken}
            >
                Faucet SOL
            </Button>
        );
    }


    return (<></>);
};
