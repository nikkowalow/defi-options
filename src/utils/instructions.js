import { 
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction
} from '@solana/web3.js';
import {encodeTokenInstructionData} from './utils'
import * as solana from '../configs/solana.json'

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
    programId: solana.programs.TOKEN_PROGRAM_ID,
  });
}