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

pub enum EscrowInstruction {
    InitEscrow { amount: u64 },
}

pub enum TokenInstruction {
    InitializeMint {
        decimals: u8,
        mint_authority: Pubkey,
    },
}

pub enum OptionInstructions {


    CreateOption {

    },
    SellOption { //
        seller: &Pubkey,
        seller_token_account: Account,
        init_token_account: Account,
        option_account: AccountInfo,
        required_rent: sysvar, //not sure what this does exactly. need to calculate rent exemption later
        token_program: &Pubkey,
    },
    BuyOption {
        buyer: &Pubkey,
        buyer_token_account: Account, //for sending/receiving premium
        received_token_account: Account,
        required_rent: sysvar, //not sure what this does exactly. need to calculate rent exemption later
    },

}


impl enum OptionInstruction {

    pub fn create_option() [

    ]

    pub fn sell_option()  {

    }

    pub fn buy_option() {

    }

}


impl EscrowInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::InitEscrow {
                amount: Self::unpack_amount(rest)?,
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
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
