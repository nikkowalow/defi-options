import {
  Account,
  Connection,
  PublicKey,
  TransactionSignature
} from '@solana/web3.js';



export let connection: Connection;
let demoAccount: Account;
export let programId: PublicKey = new PublicKey("Gqj6LTnJy1c1tV4oXGek2nrozKsX2TCQoSUKpXR8doKe");


import * as config from './configs/solana.json';

export async function connect(): Promise<void> {
  connection = new Connection(config.endpoints.DEVNET_CLUSTER, 'singleGossip');
  console.log(`connected @ ${config.endpoints.DEVNET_CLUSTER}`);
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
  return config.endpoints.DEVNET_CLUSTER;
}

export async function airdrop(key:PublicKey, amount:number): Promise<TransactionSignature> {
  let drop = await connection.requestAirdrop(demoAccount.publicKey, amount);
  return drop;
}

export async function getBalance(key:PublicKey): Promise<number> {
  let balance = await connection.getBalance(key);
  return balance;
}

export function isValidKey(key: PublicKey) {
  let str = key.toString();
  return str.match(/^[0-9a-zA-Z]+$/) && str.length >= 44 && str.length <= 45;
}









