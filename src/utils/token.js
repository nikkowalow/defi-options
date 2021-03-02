import * as BufferLayout from 'buffer-layout';
import {
  Account,
  Connection,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import fs from 'mz/fs';
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

LAYOUT.addVariant(
    9,
    BufferLayout.struct([
        BufferLayout.u32('underlyingAsset'),
        BufferLayout.u32('expDate'),
        BufferLayout.u8('strikePrice'),
        BufferLayout.u8('pairAsset'),
        BufferLayout.u8('lotSize'),
        BufferLayout.u8('isCall'),
    ]),
    'initializeInstrument',
)


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

export const createInstrument = async (wallet, connection) => {
  let mint = new Account();
  let exchange = new Account();
  await connection.requestAirdrop(exchange.publicKey, 2 * LAMPORTS_PER_SOL);
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
    return [mint, initialAccount];
}






let financerAccount;

let programId;



const pathToProgram = '../../program/src/target/deploy/target/';

const greetedAccountDataLayout = BufferLayout.struct([
  BufferLayout.u32('numGreets'),
]);

export async function establishPayer(connection) {
  let financerAccount = new Account();
  await connection.requestAirdrop(financerAccount.publicKey, LAMPORTS_PER_SOL);
  return financerAccount;
}

export async function loadProgram(wallet, connection) {

   let financerAccount = establishPayer(connection);
  // Check if the program has already been loaded
  let instrumentAccount = new Account();

  try {
    programId = new PublicKey(solana.programs.DERIVATIVES_EXCHANGE_PROGRAM_ID);
    instrumentAccount = new Account();
    await connection.getAccountInfo(programId);
    console.log('Program already loaded to account', programId.toBase58());
    return;
  } catch (err) {
    // try to load the program

  console.log('Loading hello world program...');
  const data = await fs.readFile(pathToProgram);
  const programAccount = new Account();
  await BpfLoader.load(
    connection,
    financerAccount,
    programAccount,
    data,
    BPF_LOADER_PROGRAM_ID,
  );
  programId = programAccount.publicKey;
  console.log('Program loaded to account', programId.toBase58());


  console.log('Creating instrument: ', instrumentAccount.publicKey.toBase58() + "...");
    let keys = createInstrument(wallet, connection);
    console.log(keys);
}
}

//modify instrument data
export async function sayHello(connection, instrumentAccount, financerAccount) {
  console.log('Saying hello to', instrumentAccount.publicKey.toBase58());
  const instruction = new TransactionInstruction({
    keys: [{pubkey: instrumentAccount.publicKey, isSigner: false, isWritable: true}],
    programId,
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [financerAccount],
    {
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip',
    },
  );
}

// receieve data about option to display
export async function reportHellos(connection, instrumentAccount) {
  const accountInfo = await connection.getAccountInfo(instrumentAccount.publicKey);
  if (accountInfo === null) {
    throw 'Error: cannot find instrument';
  }
    const info = greetedAccountDataLayout.decode(Buffer.from(accountInfo.data));
        console.log(
        instrumentAccount.publicKey.toBase58(),
            'has been greeted',
            info.numGreets.toString(),
            'times',
        );
}



