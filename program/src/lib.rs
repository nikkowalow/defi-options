#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;
pub mod instruction;
pub mod error;
pub mod processor;
pub mod state;