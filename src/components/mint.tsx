import React, { useCallback } from "react";
import { useWallet } from "../models/wallet";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { createInstrument, depositCollateral, loadProgram } from '../utils/token.js';
import { useConnection } from '../models/connection';

export const Mint = () => {

    const { wallet, connection } = useWallet();


    const mint = () => {
        loadProgram(wallet, connection);
    }

    const createOption = async () => {
        console.log(`creating account`);
        createInstrument(wallet, connection);
    }

    const transfer = async () => {
        console.log('transfering...');
        depositCollateral(
            connection,
            wallet,
            10000,
        );
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
                <button className="button">
                    Burn Token
                </button>
                <button className="button" onClick={createOption}>
                    create option
                </button>
                <button className="button" onClick={transfer}>
                    transfer funds
                </button>
            </div>
        </div>
    );
};
