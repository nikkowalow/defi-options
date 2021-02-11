import { LAMPORTS_PER_SOL, NonceAccount, PublicKey } from "@solana/web3.js"

import {
    Connection, 
    TransactionInstruction,
    sendAndConfirmTransaction,
    Transaction,
    Account,
    SystemProgram
} from '@solana/web3.js'

import {
    getBalance,
    isValidKey, 
    airdrop
} from './solanaHelperMethods';

import * as BufferLayout from 'buffer-layout';

import {
    connection,
    programId
} from './solanaHelperMethods';



export class ImageAccount {

    private imagePubkey: any;
    private voterAccount: any;
    private votedOnAccountLayout = BufferLayout.struct([BufferLayout.u32('votes')]);


    async makeImage(): Promise<void> {

        if(!this.imagePubkey) {
            const votedOnAccount = new Account();
            this.imagePubkey = votedOnAccount.publicKey;
            console.log(this.imagePubkey.toString());
            const space = this.votedOnAccountLayout.span;
            // const lamports = await connection.getMinimumBalanceForRentExemption(
            //     this.votedOnAccountLayout.span,
            // );
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                fromPubkey: this.voterAccount.publicKey,
                newAccountPubkey: this.imagePubkey,
                lamports: LAMPORTS_PER_SOL,
                space,
                programId,
                }),
            );
            await sendAndConfirmTransaction(
                connection,
                transaction,
                [this.voterAccount, votedOnAccount],
                {
                commitment: 'singleGossip',
                preflightCommitment: 'singleGossip',
                },
            );
        }
    }

    async createVoter(): Promise<void> {
        if (!this.voterAccount) {
            const STARTING_SOL_AMOUNT = LAMPORTS_PER_SOL * 10;
            const account = new Account();

            let retries = 10;
            await connection.requestAirdrop(account.publicKey, STARTING_SOL_AMOUNT);
            for (;;) {
                if (STARTING_SOL_AMOUNT == (await connection.getBalance(account.publicKey))) {
                    this.voterAccount = account;
                }
                if (--retries <= 0) {
                break;
                }
                console.log(`Airdrop retry ${retries}`);
            }
            throw new Error(`Airdrop of ${STARTING_SOL_AMOUNT} failed`);
            
        }        
    }


    async vote(): Promise<void> {
        const instruction = new TransactionInstruction({
            keys: [{pubkey: this.imagePubkey, isSigner: false, isWritable: true}],
            programId: programId,
            data: Buffer.alloc(0)
        });
        await sendAndConfirmTransaction(
            connection,
            new Transaction().add(instruction),
            [this.voterAccount],
            {commitment: 'singleGossip'}
        );
    }

    async countVotes(): Promise<number> {
        const accountInfo = await connection.getAccountInfo(this.imagePubkey);
        if (!accountInfo) {
            throw 'Error: cannot find the greeted account';
        }
        const info = this.votedOnAccountLayout.decode(Buffer.from(accountInfo.data));
        console.log(
            this.imagePubkey.toBase58(),
            'has',
            info.votes.toString(),
            'votes',
        );
        return info.votes;
    }

}