import * as BufferLayout from 'buffer-layout';

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(44),
  BufferLayout.u8('decimals'),
  BufferLayout.blob(37),
]);

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export const OPTION_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('strike'),
  BufferLayout.nu64('exp-date'),
  BufferLayout.nu64('underlying-assets'),
  BufferLayout.nu64('instrument-type'),
  BufferLayout.nu64('lot-size'),
]);

export const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'));