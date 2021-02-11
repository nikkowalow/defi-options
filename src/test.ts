import { load } from 'dotenv/types';
import {
  airdropTest,
  connect,
  loadProgram,
  newAccountWithLamports,
} from './solanaHelperMethods';

async function main() {
  console.log("Let's say hello to a Solana account...");

  // Establish connection to the cluster
  await connect();

  await airdropTest();

  await loadProgram();

  console.log('Success');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);