import * as BufferLayout from 'buffer-layout';
import { 
   Account,
   SystemProgram, 
   Transaction,
   SYSVAR_RENT_PUBKEY,
   TransactionInstruction,
   PublicKey,
   LAMPORTS_PER_SOL,
   sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as solana from '../configs/solana.json';
import {signAndSendTransaction} from './utils';
import * as instrument from '../configs/instrument.json';

export const TOKEN_PROGRAM_ID = new PublicKey(solana.programs.TOKEN_PROGRAM_ID);
const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'));


LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    BufferLayout.u8('decimals'),
    BufferLayout.blob(32, 'mintAuthority'),
    BufferLayout.u8('freezeAuthorityOption'),
    BufferLayout.blob(32, 'freezeAuthority'),
  ]),
  'initializeMint',
);

LAYOUT.addVariant(1, BufferLayout.struct([]), 'initializeAccount');
LAYOUT.addVariant(
  3,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'transfer',
);
LAYOUT.addVariant(
  7,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'mintTo',
);
LAYOUT.addVariant(
  8,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'burn',
);
LAYOUT.addVariant(9, BufferLayout.struct([]), 'closeAccount');



export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export function mintTo({ mint, destination, amount, mintAuthority }) {
  let keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: mintAuthority, isSigner: true, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    data: encodeTokenInstructionData({
      mintTo: {
        amount,
      },
    }),
    programId: TOKEN_PROGRAM_ID,
  });
}



const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r) => r.span),
);




function encodeTokenInstructionData(instruction) {
  let b = Buffer.alloc(instructionMaxSpan);
  let span = LAYOUT.encode(instruction, b);
  return b.slice(0, span);
}




export function initializeAccount({ account, mint, owner }) {
  let keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    data: encodeTokenInstructionData({
      initializeAccount: {},
    }),
    programId: TOKEN_PROGRAM_ID,
  });
}




export async function depositCollateral(
  connection,
  wallet,  
  amount,
) {

  let depositer = new PublicKey("FS86giTYW3V2cgfQwC9rpnXyTiwYpyPZBX5LjbD3oTNq");
  let receiver = new PublicKey("6VF8J7jKnBbTEooSG25rFk83sqamkZL3vGDQFxTWYQoT");

  console.log(`wallet balance: ${await connection.getBalance(wallet.publicKey)}`);
    console.log(`receiver balance: ${await connection.getBalance(receiver)}`);

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: receiver,
      lamports: amount,
    }),
  );
  return await signAndSendTransaction(connection, tx, wallet, []);
}




export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(44),
  BufferLayout.u8('decimals'),
  BufferLayout.blob(37),
]);

export function initializeMint({
  mint,
  decimals,
  mintAuthority,
  freezeAuthority,
}) {
  let keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    data: encodeTokenInstructionData({
      initializeMint: {
        decimals,
        mintAuthority: mintAuthority.toBuffer(),
        freezeAuthorityOption: !!freezeAuthority,
        freezeAuthority: (freezeAuthority).toBuffer(),
      },
    }),
    programId: TOKEN_PROGRAM_ID,
  });
}


export async function createAndInitializeMint({
  connection,  
  owner, 
  mint, 
  amount,
  decimals,
  initialAccount,
  depositer
}) {
  let transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: owner.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MINT_LAYOUT.span,
      ),
      space: MINT_LAYOUT.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  );
  transaction.add(
    initializeMint({
      mint: mint.publicKey,
      decimals,
      mintAuthority: owner.publicKey,
      freezeAuthority: owner.publicKey
    }),
  );
  let signers = [mint];
  if (amount > 0) {
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: owner.publicKey,
        newAccountPubkey: initialAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
        ),
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    signers.push(initialAccount);
    transaction.add(
      initializeAccount({
        account: initialAccount.publicKey,
        mint: mint.publicKey,
        owner: owner.publicKey,
      }),
    );
    transaction.add(
      mintTo({
        mint: mint.publicKey,
        destination: initialAccount.publicKey,
        amount,
        mintAuthority: owner.publicKey,
      }),
    );
  }
    console.log('owner');
    console.log(initialAccount.publicKey.toString());
    console.log('mint');
    console.log(mint.publicKey.toString());
  return await signAndSendTransaction(connection, transaction, owner, signers);
}

export const mintToken = async (wallet, connection) => {
  let mint = new Account();
  let exchange = new Account();
  await connection.requestAirdrop(exchange.publicKey, 2 * LAMPORTS_PER_SOL);
    //   SystemProgram.createAccount({
    //     fromPubkey: wallet.publicKey,
    //     newAccountPubkey: exchange.publicKey,
    //     lamports: await connection.getMinimumBalanceForRentExemption(
    //       ACCOUNT_LAYOUT.span,
    //     ),
    //     space: ACCOUNT_LAYOUT.span,
    //     programId: TOKEN_PROGRAM_ID,
    //   });


      let initialAccount = new Account();

    createAndInitializeMint({
      connection: connection,
      owner: exchange,
      mint,
      amount: 100,
      decimals: 0,
      initialAccount,
      depositer: new Account()
    });
}




function sleep(ms) {
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
