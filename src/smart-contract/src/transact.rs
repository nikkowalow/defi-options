use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

pub fn process_instruction(
    _program_id: &Pubkey,
    account: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult {
    let account_info_iterator = &mut accounts.iter();

    let source_info = next_account_info(account_info_iterator)
    let destination_info = next_account_info(account_info_iterator)
    next_account_info(iter: &mut I)


    **source_info.try_borrow_mut_lamports()? -= 5;
    **destination_info.try_borrow_mut_lamports() += 5;

    Ok(())
}