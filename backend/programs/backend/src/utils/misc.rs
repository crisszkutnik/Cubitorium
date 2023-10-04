use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

pub fn realloc_with_rent<'info>(
    new_size: usize,
    acc: &mut AccountInfo<'info>,
    funder: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
) -> Result<()> {
    let new_minimum_balance = Rent::get()?.minimum_balance(new_size);
    let lamports_diff = new_minimum_balance.saturating_sub(acc.lamports());

    invoke(
        &system_instruction::transfer(
            funder.key,
            acc.key,
            lamports_diff
        ),
        &[
            funder.clone(),
            acc.clone(),
            system_program.clone(),
        ],
    )?;

    acc.realloc(
        new_size as usize,
        false
    )?;

    Ok(())
}
