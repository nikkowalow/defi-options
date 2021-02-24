use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    msg,
    pubkey::Pubkey,
    program_pack::{Pack, IsInitialized},
    sysvar::{rent::Rent, Sysvar},
    program::invoke
};

use crate::{instruction::ThirdPartyInstruction, state::ThirdParty};


pub struct Processor;
impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
        let instruction = ThirdPartyInstruction::unpack(instruction_data)?;

        match instruction {
            ThirdPartyInstruction::InitThirdParty { amount } => {
                msg!("Instruction: InitThirdParty");
                Self::process_init_ThirdParty(accounts, amount, program_id)
            }
        }
    }

    fn process_init_ThirdParty(
        accounts: &[AccountInfo],
        amount: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let temp_token_account = next_account_info(account_info_iter)?;

        let token_to_receive_account = next_account_info(account_info_iter)?;
        if *token_to_receive_account.owner != spl_token::id() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        let ThirdParty_account = next_account_info(account_info_iter)?;
        let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;

        // if !rent.is_exempt(ThirdParty_account.lamports(), ThirdParty_account.data_len()) {
        //     return Err(ThirdPartyError::NotRentExempt.into());
        // }

        let mut ThirdParty_info = ThirdParty::unpack_unchecked(&ThirdParty_account.data.borrow())?;
        if ThirdParty_info.is_initialized() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        ThirdParty_info.is_initialized = true;
        ThirdParty_info.initializer_pubkey = *initializer.key;
        ThirdParty_info.temp_token_account_pubkey = *temp_token_account.key;
        ThirdParty_info.initializer_token_to_receive_account_pubkey = *token_to_receive_account.key;
        ThirdParty_info.expected_amount = amount;
        
        ThirdParty::pack(ThirdParty_info, &mut ThirdParty_account.data.borrow_mut())?;
        let (pda, _bump_seed) = Pubkey::find_program_address(&[b"ThirdParty"], program_id);

        let token_program = next_account_info(account_info_iter)?;
        let owner_change_ix = spl_token::instruction::set_authority(
            token_program.key,
            temp_token_account.key,
            Some(&pda),
            spl_token::instruction::AuthorityType::AccountOwner,
            initializer.key,
            &[&initializer.key],
        )?;

        msg!("Calling the token program to transfer token account ownership...");
        invoke(
            &owner_change_ix,
            &[
                temp_token_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;

        Ok(())
    }
}