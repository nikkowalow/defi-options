


import {ACCOUNT_LAYOUT, MINT_LAYOUT, OPTION_LAYOUT} from './layouts';
import {
  Account,
  Transaction,
  SystemProgram,
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import * as solana from '../configs/solana.json';
import {signAndSendTransaction} from './utils';
import {encodeTokenInstructionData} from './utils';


const TOKEN_PROGRAM_ID = new PublicKey(solana.programs.TOKEN_PROGRAM_ID);


export function createInstrumentID(underlyingAsset, expirationDate, strikePrice, optionType) {
  if(strikePrice < 0 || optionType.toUpperCase() != "C" || optionType.toUpperCase() != "P") {
    return;
  }
  const INSTRUMENT_ID = underlyingAsset + expirationDate + strikePrice.toString() + optionType.toUpperCase();
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

export async function createAndInitializeInstrument({
  connection,
  owner,
  mint,
  instrumentID
}) {
let transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: owner.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
      ),
      space: ACCOUNT_LAYOUT.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  );
  transaction.add(
    initializeMint({
      mint: mint.publicKey,
      decimals: 0,
      mintAuthority: owner.publicKey,
      freezeAuthority: owner.publicKey
    }),
  );
  let signers = [mint];
  return await signAndSendTransaction(connection, transaction, owner, signers);

}




export function createInstrument(wallet, connection, instrumentID) {
    let owner = new Account();
    let mint = new Account();
    createAndInitializeInstrument({
      connection,
      owner, //change to option program ID later
      mint,
      instrumentID,
    });

}