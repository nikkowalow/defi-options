// new testnet pubkey
// ======================================================================
// pubkey: 25CwjKDxt7ti7chSNcnpTBkLEBMtTa6P2zfk9HtEdss9
// ======================================================================
// Save this seed phrase to recover your new keypair:
// pulse shell kind supply canoe note network burst cart cheap relax wash
// ======================================================================

//programId: Gqj6LTnJy1c1tV4oXGek2nrozKsX2TCQoSUKpXR8doKe

import {
  Account,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionSignature,
  sendAndConfirmTransaction,
  TransactionInstruction,
  Transaction,
  SystemProgram
} from '@solana/web3.js';


import * as BufferLayout from 'buffer-layout';

export let connection: Connection;
let demoAccount: Account;
let voterAccount: Account; 
export let programId: PublicKey = new PublicKey("Gqj6LTnJy1c1tV4oXGek2nrozKsX2TCQoSUKpXR8doKe");
let votedOnPubkey: PublicKey = new PublicKey("8spckFD8pEwZG1Vip76Vk6YhjBHirRzHFUibsVWVVw1c");

export const CLUSTER = "https://devnet.solana.com";


const votedOnAccountLayout = BufferLayout.struct([BufferLayout.u32('votes')]);


export async function connect(): Promise<void> {
  connection = new Connection(CLUSTER, 'singleGossip');
  console.log(`connected @ ${CLUSTER}`);
}

export async function newAccountWithLamports(
  lamports = 1000000,
): Promise<Account> {
  const account = new Account();

  let retries = 10;
  await connection.requestAirdrop(account.publicKey, lamports);
  for (;;) {
    if (lamports == (await connection.getBalance(account.publicKey))) {
      return account;
    }
    if (--retries <= 0) {
      break;
    }
    console.log(`Airdrop retry ${retries}`);
  }
  throw new Error(`Airdrop of ${lamports} failed`);
}

export function getCluster(): string {
  return CLUSTER;
}

export async function airdrop(key:PublicKey, amount:number): Promise<TransactionSignature> {
  console.log(`balance pre airdrop: ${getBalance(key)} SOL`);
  let drop = await connection.requestAirdrop(demoAccount.publicKey, amount);
  console.log(`balance post airdorp: ${getBalance(key)} SOL`);
  return drop;
}

export async function getBalance(key:PublicKey): Promise<number> {
  let balance = await connection.getBalance(key);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`); 
  return balance;
}

export function isValidKey(key: PublicKey) {
  let str = key.toString();
  return str.match(/^[0-9a-zA-Z]+$/) && str.length >= 44 && str.length <= 45;
}

export async function airdropTest() {
  let acc = new Account();
  console.log(await connection.getBalance(acc.publicKey));
  acc = await newAccountWithLamports();
  console.log(await connection.getBalance(acc.publicKey));
}









