import { Button, Dropdown, Menu } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";
import { useWallet } from "../models/wallet";

export interface ConnectButtonProps
    extends ButtonProps,
    React.RefAttributes<HTMLElement> {
    allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
    const { connected, connect, provider, disconnect } = useWallet();
    const { onClick, allowWalletChange } = props;



    if (!provider || !allowWalletChange) {
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

    return (<></>);


};
