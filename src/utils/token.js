import * as BufferLayout from 'buffer-layout';
import {LAYOUT, ACCOUNT_LAYOUT, MINT_LAYOUT} from './layouts';
import {
  newAccountWithLamports,
  instructionMaxSpan,
  encodeTokenInstructionData,
  signAndSendTransaction
} from './utils';
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

const TOKEN_PROGRAM_ID = new PublicKey(solana.programs.TOKEN_PROGRAM_ID);

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
    console.log(owner.publicKey.toString());
    console.log('mint');
    console.log(mint.publicKey.toString());
  return await signAndSendTransaction(connection, transaction, owner, signers);
}

export const mintToken = async (wallet, connection) => {
  let mint = new Account();
  let exchange = new Account();
  await connection.requestAirdrop(exchange.publicKey, 2 * LAMPORTS_PER_SOL);
  console.log(await connection.getBalance(exchange.publicKey));
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: exchange.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
        ),
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID,
      });
        console.log(await connection.getBalance(exchange.publicKey));
    createAndInitializeMint({
      connection: connection,
      owner: exchange,
      mint,
      amount: 10000,
      decimals: 2,
      initialAccount: new Account(),
    });
}