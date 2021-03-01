use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};

use chrono::prelude::{Utc, NaiveDateTime, DateTime};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use crate::{error::OptionFactoryError};


pub struct OptionModel {
    pub is_call: bool,
    pub underlying_asset: u64,
    pub strike_asset: u64,
    pub strike_price: u64,
    pub expiration_time: u64,
}

impl OptionModel {
    const SOL: u64 = 0x0;

    pub fn get_option_type_symbol(&self) -> String {
        return if self.is_call { String::from("C") } else { String::from("P") };
    }

    pub fn get_underlying_asset_symbol(&self) -> Result<String, ProgramError> {
        let underlying_asset = String::from("");
        if self.underlying_asset == OptionModel::SOL {
            underlying_asset = String::from("SOL");
        }
        if underlying_asset.is_empty() {
            return Err(OptionFactoryError::InvalidUnderlyingAsset.into());
        }
        Ok(underlying_asset)
    }

    pub fn get_strike_asset_symbol(&self) -> Result<String, ProgramError> {
        let strike_asset = String::from("");
        if self.strike_asset == OptionModel::SOL {
            strike_asset = String::from("SOL");
        }
        if strike_asset.is_empty() {
            return Err(OptionFactoryError::InvalidStrikeAsset.into());
        }
        Ok(strike_asset)
    }

    pub fn get_strike_price_string(&self) -> String {
        return self.strike_price.to_string();
    }

    pub fn get_expiration_time_string(&self) -> String {
        return self.expiration_time.to_string();
    }

    pub fn get_instrument_id(&self) -> Result<String, ProgramError> {
        Ok([self.get_underlying_asset_symbol()?, String::from("-"), self.get_strike_price_string(), ].join(""));
    }
}

impl Sealed for OptionModel {}

impl Pack for OptionModel {
    const LEN: usize = 25;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Escrow::LEN];
        let (
            is_call,
            underlying_asset,
            strike_asset,
            strike_price,
            expiration_time,
        ) = array_refs![src, 1, 8, 8, 8, 8];

        let is_call = match is_call {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        Ok(OptionModel {
            is_call,
            underlying_asset: u64::from_le_bytes(*underlying_asset),
            strike_asset: u64::from_le_bytes(*strike_asset),
            strike_price: u64::from_le_bytes(*strike_price),
            expiration_time: u64::from_le_bytes(*expiration_time),
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Escrow::LEN];
        let (
            is_call_dst,
            underlying_asset_dst,
            strike_asset_dst,
            strike_price_dst,
            expiration_time_dst,
        ) = mut_array_refs![dst, 1, 8, 8, 8, 8];

        let OptionModel {
            is_call,
            underlying_asset,
            strike_asset,
            strike_price,
            expiration_time,
        } = self;

        is_call_dst[0] = *is_call as u8;
        *underlying_asset_dst = underlying_asset.to_le_bytes();
        *strike_asset_dst = strike_asset.to_le_bytes();
        *strike_price_dst = strike_price.to_le_bytes();
        *expiration_time_dst = expiration_time.to_le_bytes();
    }
}


pub struct Escrow {
    pub is_initialized: bool,
    pub initializer_pubkey: Pubkey,
    pub temp_token_account_pubkey: Pubkey,
    pub initializer_token_to_receive_account_pubkey: Pubkey,
    pub expected_amount: u64,
}

impl Sealed for Escrow {}

impl IsInitialized for Escrow {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Escrow {
    const LEN: usize = 105;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Escrow::LEN];
        let (
            is_initialized,
            initializer_pubkey,
            temp_token_account_pubkey,
            initializer_token_to_receive_account_pubkey,
            expected_amount,
        ) = array_refs![src, 1, 32, 32, 32, 8];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        Ok(Escrow {
            is_initialized,
            initializer_pubkey: Pubkey::new_from_array(*initializer_pubkey),
            temp_token_account_pubkey: Pubkey::new_from_array(*temp_token_account_pubkey),
            initializer_token_to_receive_account_pubkey: Pubkey::new_from_array(
                *initializer_token_to_receive_account_pubkey,
            ),
            expected_amount: u64::from_le_bytes(*expected_amount),
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Escrow::LEN];
        let (
            is_initialized_dst,
            initializer_pubkey_dst,
            temp_token_account_pubkey_dst,
            initializer_token_to_receive_account_pubkey_dst,
            expected_amount_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 32, 8];

        let Escrow {
            is_initialized,
            initializer_pubkey,
            temp_token_account_pubkey,
            initializer_token_to_receive_account_pubkey,
            expected_amount,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        initializer_pubkey_dst.copy_from_slice(initializer_pubkey.as_ref());
        temp_token_account_pubkey_dst.copy_from_slice(temp_token_account_pubkey.as_ref());
        initializer_token_to_receive_account_pubkey_dst
            .copy_from_slice(initializer_token_to_receive_account_pubkey.as_ref());
        *expected_amount_dst = expected_amount.to_le_bytes();
    }
}
