#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod nikitatest {
    use super::*;

  pub fn close(_ctx: Context<CloseNikitatest>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.nikitatest.count = ctx.accounts.nikitatest.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.nikitatest.count = ctx.accounts.nikitatest.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNikitatest>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.nikitatest.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNikitatest<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Nikitatest::INIT_SPACE,
  payer = payer
  )]
  pub nikitatest: Account<'info, Nikitatest>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNikitatest<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub nikitatest: Account<'info, Nikitatest>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub nikitatest: Account<'info, Nikitatest>,
}

#[account]
#[derive(InitSpace)]
pub struct Nikitatest {
  count: u8,
}
