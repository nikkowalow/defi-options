// inside error.rs
use thiserror::Error;

use solana_program::program_error::ProgramError;


#[derive(Error, Debug, Copy, Clone)]
pub enum ThirdPartyError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
}

impl From<ThirdPartyError> for ProgramError {
    fn from(e: ThirdPartyError) -> Self {
        ProgramError::Custom(e as u32)
    }
}