use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};

use spl_token::state::Account as TokenAccount;
use crate::instruction::OptionInstruction;



pub struct Processor;
impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
        let instruction = OptionInstruction::unpack(instruction_data)?;

        match instruction {
            OptionInstruction::BuyOption { strike_price, expiration_date, amount } => {
                msg!("Instruction: BuyOption");
                Self::process_buy_option(accounts, strike_price, expiration_date, amount, program_id)
            }
            OptionInstruction::SellOption { strike_price, expiration_date, amount } => {
                msg!("Sell Option");
                Self::process_sell_option(accounts, strike_price, expiration_date, amount, program_id)
            }
        }
    }

    fn process_buy_option(accounts: &[AccountInfo], strike_price: u64, expiration_date: u64, amount:u64, program_id:&Pubkey) -> ProgramResult {

    }

    fn process_sell_option(accounts: &[AccountInfo], strike_price: u64, expiration_date: u64, amount:u64, program_id:&Pubkey) -> ProgramResult {
        
    }
}