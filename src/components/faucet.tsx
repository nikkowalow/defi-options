import React, { useCallback } from "react";
import { useConnection } from "../models/connection";
import { useWallet } from "../models/wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const Faucet = () => {
    const connection = useConnection();
    const { publicKey } = useWallet();

    function airdrop() {
        if (publicKey) connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
    }

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <button className="button" onClick={airdrop}>
                    faucet SOL
                </button>
            </div>
        </div>
    );
};
