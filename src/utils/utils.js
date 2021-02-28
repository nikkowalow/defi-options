import {LAYOUT} from './layouts';
import {
  Account,
} from '@solana/web3.js';

export const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r) => r.span),
);

export function encodeTokenInstructionData(instruction) {
  let b = Buffer.alloc(instructionMaxSpan);
  console.log('b: ' + b.toJSON());
  let span = LAYOUT.encode(instruction, b);
  console.log('span' + span);
  return b.slice(0, span);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function newAccountWithLamports(
  connection,
  lamports = 1000000,
) {
  const account = new Account();
  let retries = 10;
  await connection.requestAirdrop(account.publicKey, lamports);
  for (;;) {
    await sleep(500);
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

export async function signAndSendTransaction(
  connection,
  transaction,
  wallet,
  signers,
  skipPreflight = false,
) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  await transaction.setSigners(
    wallet.publicKey,
    ...signers.map((s) => s.publicKey),
  );
    console.log(signers);
  if (signers.length > 0) {
    await transaction.partialSign(...signers);
  }
  console.log('waiting....');
  await transaction.partialSign(wallet);
  console.log('approved!');

  const rawTransaction = transaction.serialize();
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: false,
    preflightCommitment: 'single',
  });
}