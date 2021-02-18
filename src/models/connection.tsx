
import {
    Account,
    clusterApiUrl,
    Connection,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { WalletAdapter } from "./wallet";


export type ENV =
    | "mainnet-beta"
    | "testnet"
    | "devnet"
    | "localnet";

export const ENDPOINTS = [
    { name: "devnet" as ENV, endpoint: clusterApiUrl("devnet") }
];



interface ConnectionConfig {
    connection: Connection;
    sendConnection: Connection;
    endpoint: string;
    env: ENV;
    setEndpoint: (val: string) => void;

}
export function useLocalStorageState(key: string, defaultState?: string) {
    const [state, setState] = useState(() => {
        // NOTE: Not sure if this is ok
        const storedState = localStorage.getItem(key);
        if (storedState) {
            return JSON.parse(storedState);
        }
        return defaultState;
    });

    const setLocalStorageState = useCallback(
        (newState) => {
            const changed = state !== newState;
            if (!changed) {
                return;
            }
            setState(newState);
            if (newState === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(newState));
            }
        },
        [state, key]
    );

    return [state, setLocalStorageState];
}


const ConnectionContext = React.createContext<ConnectionConfig>({
    endpoint: 'https://devnet.solana.com',
    setEndpoint: () => { },
    connection: new Connection('https://devnet.solana.com', "recent"),
    sendConnection: new Connection('https://devnet.solana.com', "recent"),
    env: ENDPOINTS[0].name,
});

export function ConnectionProvider({ children = undefined as any }) {
    const [endpoint, setEndpoint] = useLocalStorageState(
        "connectionEndpts",
        ENDPOINTS[0].endpoint
    );


    const connection = useMemo(() => new Connection(endpoint, "recent"), [
        endpoint,
    ]);
    const sendConnection = useMemo(() => new Connection(endpoint, "recent"), [
        endpoint,
    ]);

    const env =
        ENDPOINTS.find((end) => end.endpoint === endpoint)?.name ||
        ENDPOINTS[0].name;


    useEffect(() => {
        const id = connection.onAccountChange(new Account().publicKey, () => { });
        return () => {
            connection.removeAccountChangeListener(id);
        };
    }, [connection]);

    useEffect(() => {
        const id = connection.onSlotChange(() => null);
        return () => {
            connection.removeSlotChangeListener(id);
        };
    }, [connection]);

    useEffect(() => {
        const id = sendConnection.onAccountChange(
            new Account().publicKey,
            () => { }
        );
        return () => {
            sendConnection.removeAccountChangeListener(id);
        };
    }, [sendConnection]);

    useEffect(() => {
        const id = sendConnection.onSlotChange(() => null);
        return () => {
            sendConnection.removeSlotChangeListener(id);
        };
    }, [sendConnection]);

    return (
        <ConnectionContext.Provider
            value={{
                endpoint,
                setEndpoint,
                connection,
                sendConnection,
                env,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext).connection as Connection;
}

export function useSendConnection() {
    return useContext(ConnectionContext)?.sendConnection;
}

export function useConnectionConfig() {
    const context = useContext(ConnectionContext);
    return {
        endpoint: context.endpoint,
        setEndpoint: context.setEndpoint,
        env: context.env,
    };
}




const getErrorForTransaction = async (connection: Connection, txid: string) => {
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, "max");

    const tx = await connection.getParsedConfirmedTransaction(txid);

    const errors: string[] = [];
    if (tx?.meta && tx.meta.logMessages) {
        tx.meta.logMessages.forEach((log) => {
            const regex = /Error: (.*)/gm;
            let m;
            while ((m = regex.exec(log)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                if (m.length > 1) {
                    errors.push(m[1]);
                }
            }
        });
    }

    return errors;
};

export const sendTransaction = async (
    connection: Connection,
    wallet: WalletAdapter,
    instructions: TransactionInstruction[],
    signers: Account[],
    awaitConfirmation = true
) => {
    if (!wallet?.publicKey) {
        throw new Error("Wallet is not connected");
    }

    let transaction = new Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (
        await connection.getRecentBlockhash("max")
    ).blockhash;
    transaction.setSigners(
        // fee payied by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
    );
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    transaction = await wallet.signTransaction(transaction);
    const rawTransaction = transaction.serialize();
    let options = {
        skipPreflight: true,
        commitment: "singleGossip",
    };

    const txid = await connection.sendRawTransaction(rawTransaction, options);

    if (awaitConfirmation) {
        const status = (
            await connection.confirmTransaction(
                txid,
                options && (options.commitment as any)
            )
        ).value;

        if (status?.err) {
            const errors = await getErrorForTransaction(connection, txid);


            throw new Error(
                `Raw transaction ${txid} failed (${JSON.stringify(status)})`
            );
        }
    }

    return txid;
};
