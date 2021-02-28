import React, { useCallback } from "react";
import { useWallet } from "../models/wallet";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { mintToken } from '../utils/token(old).js';
import { useConnection } from '../models/connection';

export const Mint = () => {

    const { wallet, connection } = useWallet();
    const connection2 = useConnection();
    const connection3 = new Connection('https://devnet.solana.com', 'recent');

    const mint = async () => {
        console.log(`OnClick - minting...`);
        mintToken(wallet, connection);

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
