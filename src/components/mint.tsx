import React, { useCallback } from "react";
import { useWallet } from "../models/wallet";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { mintToken } from '../utils/token.js';
import { useConnection } from '../models/connection';

export const Mint = () => {

    const { wallet, connection } = useWallet();


    const mint = async () => {
        console.log(`OnClick - minting...`);
        mintToken(wallet, connection);
    }

    // const burn = async () => {
    //     burnToken(wallet, connection, new PublicKey("9cYifDBhg4SJfYtPxjpZuzffz8hctwg8UnKGXcz8SmT1"), 10);
    // }

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <button className="button" onClick={mint}>
                    Mint token
                </button>
                {/* <button style={{ left: 10 }} className="button" onClick={burn}>
                    Burn Token
                </button> */}
            </div>
        </div>
    );
};
