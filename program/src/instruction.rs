use solana_program::program_error::ProgramError;
use std::{
    convert::TryInto,
    string::String,
};

use solana_program::{
    program_pack::{IsInitialized, Pack},
};

use crate::{
    state::OptionModel,
    error::OptionFactoryError::InvalidInstruction,
};

pub enum OptionFactoryInstruction {
    /// Creates the option token(s) by creating (or using if existing) an option account, transferring underlying asset to PDA, and giving options token to user
    ///
    /// Accounts expected:
    /// 
    /// 0. `[signer]` The account of the seller of the particular option
    /// 1. `[writable]` The underlying asset
    /// 2. `[writable]` A mint of an options token
    /// 3. `[]` The initializer's token account for the options token they will recieve if creation is successful
    /// 4. `[]` The rent sysvar
    /// 5. `[] The token program
    Create {
        /// The length of the instrument_id string to be initialized
        option: OptionModel,
    },


    /// Accepts a trade
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` The account of the option executer
    /// 1. `[writable]` The executer's token account for the option token
    /// 2. `[writable]` The taker's token account for the underlying asset to recieve
    /// 3. `[writable]` The 

    /// 1. `[writable]` The taker's token account for the token they send
    /// 2. `[writable]` The taker's token account for the token they will receive should the trade go through
    /// 3. `[writable]` The PDA's temp token account to get tokens from and eventually close
    /// 4. `[writable]` The initializer's main account to send their rent fees to
    /// 5. `[writable]` The initializer's token account that will receive tokens
    /// 6. `[writable]` The escrow account holding the escrow info
    /// 7. `[]` The token program
    /// 8. `[]` The PDA account
    Execute {
        /// The length of the instrument_id string to be executed
        option: OptionModel,
    },
}

impl OptionFactoryInstruction {
    /// Unpacks a byte buffer into a [EscrowInstruction](enum.EscrowInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, instrument_id) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::Create {
                option: OptionModel::unpack_from_slice(instrument_id)?,
            },
            1 => Self::Execute {
                option: OptionModel::unpack_from_slice(instrument_id)?,
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }
}