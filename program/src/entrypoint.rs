use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey
};

use crate::processor::Processor;

use solana_program::{
    account_info::{next_account_info}
};

use solana_sdk::{
    signature::{Keypair, Signer},
};

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;
    let decimals = 9;

    let keypair = Keypair::new();
    let token = keypair.pubkey();

    Processor::process_create_token(*account.key, decimals, token, false)
}
