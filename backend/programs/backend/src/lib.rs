use anchor_lang::prelude::*;

declare_id!("13YVuPAdZDTe1xssYDwTg6ndGFhhSMv3tZxh8s2wyZMA");

#[program]
pub mod backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
