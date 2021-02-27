import React, { useCallback } from "react";
import { useConnection } from "../models/connection";
import { useWallet } from "../models/wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { mintToken } from '../utils/token';

export const Mint = () => {

    const wallet = useWallet();

    const mint = () => {
        console.log('mint');
        mintToken(wallet);
    }

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <button className="button" onClick={mint}>
                    Mint token
                </button>
            </div>
        </div>
    );
};
