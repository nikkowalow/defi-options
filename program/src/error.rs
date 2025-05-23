use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum OptionFactoryError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
    /// Not Rent Exempt
    #[error("Not Rent Exempt")]
    NotRentExempt,
    /// Expected Amount Mismatch
    #[error("Expected Amount Mismatch")]
    ExpectedAmountMismatch,
    /// Amount Overflow
    #[error("Amount Overflow")]
    AmountOverflow,
    #[error("Invalid Underlying Asset")]
    InvalidUnderlyingAsset
    #[error("Invalid Strike Asset")]
    InvalidStrikeAsset
}

impl From<OptionFactoryError> for ProgramError {
    fn from(e: OptionFactoryError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
