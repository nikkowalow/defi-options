use byteorder::{ByteOrder, LittleEndian};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

use std::mem;
use solana_program::clock::Epoch;

#[cfg(not(feature = "exclude_entrypoint"))]

fn main() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u64>()];
        LittleEndian::write_u64(&mut data, 0);
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );
        let instruction_data: Vec<u8> = Vec::new();
        let accounts = vec![account];
        let instruction = process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        msg!("{:?}", instruction);
}

fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo], 
    _instruction_data: &[u8], 
) -> ProgramResult {
    msg!("Helloworld Rust program entrypoint");
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    if account.try_data_len()? < mem::size_of::<u32>() {
        return Err(ProgramError::InvalidAccountData);
    }
    let mut data = account.try_borrow_mut_data()?;
    let mut counter = LittleEndian::read_u32(&data);
    counter += 2;
    LittleEndian::write_u32(&mut data[0..], counter);
    msg!("counter++");
    Ok(())
}


//testing
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test1() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u64>()];
        LittleEndian::write_u64(&mut data, 0);
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let instruction_data: Vec<u8> = Vec::new();
        let accounts = vec![account];

        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 0);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 2);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 4);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 6);
    }
    #[test]
    fn test2() {
        assert_eq!(5,5);
    }

}

