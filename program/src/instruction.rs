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
// `[signer]` Seller -> Account selling the options instrument
// `[writable]` Temporary token account owned by seller, holding underlying asset
// `[]` Initializer token account for the premium they will receive (token) should the trade go through (premium)
// `[writable]` the option account, it will hold necessary info about trade
// `[]` rent sysvar
// `[]` the token program

    SellOption { 
        strike_price: u64,
        expiration_date: u64,
        amount: u64,
    },

// `[signer]` Account buying the options instrument
// `[writable]` the buyer’s token account for the premium they send
// `[writable]` the buyer’s token account for the options token they will receive should the trade go through
// `[writable]` the PDA’s temp token account with the option to get tokens from and eventually close

    BuyOption {
        strike_price: u64,
        expiration_date: u64,
        amount: u64,
    },

    ExecuteOption {

    }
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
            2 => Self::ExecuteOption {

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
