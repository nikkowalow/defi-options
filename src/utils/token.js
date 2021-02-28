import * as BufferLayout from 'buffer-layout';
import {
  SystemProgram,
  Account,
  Transaction,
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import * as solana from '../configs/solana.json';

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(44),
  BufferLayout.u8('decimals'),
  BufferLayout.blob(37),
]);


export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

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

const TOKEN_PROGRAM_ID = new PublicKey(solana.programs.TOKEN_PROGRAM_ID);

const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r) => r.span),
);

function encodeTokenInstructionData(instruction) {
  console.log(`encoding: ${instruction}`);
  let b = Buffer.alloc(instructionMaxSpan);
  let span = LAYOUT.encode(instruction, b);
  return b.slice(0, span);
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
        freezeAuthority: (freezeAuthority || new PublicKey("FS86giTYW3V2cgfQwC9rpnXyTiwYpyPZBX5LjbD3oTNq")).toBuffer(),
      },
    }),
    programId: TOKEN_PROGRAM_ID,
  });
}

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
        mint,
        destination,
        amount,
        mintAuthority
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



export async function signAndSendTransaction(
  connection,
  transaction,
  wallet,
  signers,
  skipPreflight = false,
) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash;
  transaction.setSigners(
    // fee payed by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey),
  );

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
    preflightCommitment: 'single',
  });
}

export async function createAndInitializeMint({
  connection,
  owner, // Wallet for paying fees and allowed to mint new tokens
  mint, // Account to hold token information
  amount, // Number of tokens to issue
  decimals,
  initialAccount, // Account to hold newly issued tokens, if amount > 0
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
      freezeAuthority: owner.publicKey,
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

  return await signAndSendTransaction(connection, transaction, owner, signers);
}

  export const mintToken = async (wallet, connection) => {
    let mint = new Account();

    console.log(`wallet connection: ${wallet.connection}`);
    try {
      await createAndInitializeMint({
        connection: connection,
        owner: wallet,
        mint,
        amount: 1000,
        decimals: 2,
        initialAccount: new Account(),
      });
    } catch(error){
      console.error(error);
    }
  }