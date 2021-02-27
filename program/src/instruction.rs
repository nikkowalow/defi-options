use byteorder::{ByteOrder, LittleEndian};

use solana_program::program_error::ProgramError;
use std::convert::TryInto;

use crate::error::EscrowError::InvalidInstruction;

use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    msg,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar,
};
use spl_token::{
    self,
    state::{Account, Mint},
};

pub enum TokenInstruction {
    InitializeMint {
        decimals: u8,
        mint_authority: Pubkey,
    },
}

pub enum OptionInstruction {
    SellOption { 
        strike_price: u64,
        expiration_date: u64,
        amount: u64,
    },
    BuyOption {
        strike_price: u64,
        expiration_date: u64,
        amount: u64,
    },
}

impl OptionInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (option_type, rest) = input.split_first().ok_or(InvalidInstruction)?;
        let (strike_price, expiration_date, amount) = Self::unpack_option_info(rest)?;

        Ok(match option_type {
            0 => Self::SellOption {
                strike_price: strike_price,
                expiration_date: expiration_date,
                amount: amount,
            },
            1 => Self::BuyOption {
                strike_price: strike_price,
                expiration_date: expiration_date,
                amount: amount,
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_option_info(input: &[u8]) -> Result<(u64, u64, u64), ProgramError> {
        let strike_price = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        let strike_date = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        let strike_amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok((strike_price, strike_date, strike_amount))
    }
}

impl TokenInstruction {
    pub fn initialize_mint(
        token_program_id: &Pubkey,
        mint_pubkey: &Pubkey,
        mint_authority_pubkey: &Pubkey,
        decimals: u8,
    ) -> ProgramResult {
        let mut data = TokenInstruction::InitializeMint {
            decimals,
            mint_authority: *mint_authority_pubkey,
        };
        let accounts = vec![
            AccountMeta::new(*mint_pubkey, false),
            AccountMeta::new_readonly(sysvar::rent::id(), false),
        ];

        Ok(())
    }
}
