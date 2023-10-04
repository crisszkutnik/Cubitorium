use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

use crate::error::UserInfoError;


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

/// Asserts that date matches yyyy-mm-dd format (Regex crate didn't work...)
pub fn check_date(date: &str) -> Result<()> {
    let year = date[0..=3].parse::<u32>().map_err(|_| UserInfoError::WrongDateFormat)?;
    let month = date[5..=6].parse::<u32>().map_err(|_| UserInfoError::WrongDateFormat)?;
    let day = date[8..=9].parse::<u32>().map_err(|_| UserInfoError::WrongDateFormat)?;

    if !(
        date.len() == 10 &&
        date[0..=3].parse::<u32>().is_ok() &&
        month <= 12 && day <= [31,leap_feb(year),31,30,31,30,31,31,30,31,30,31][month as usize - 1] &&
        date.chars().nth(4).unwrap() == '-' &&
        date.chars().nth(7).unwrap() == '-'
    ) {
        err!(UserInfoError::WrongDateFormat)?
    }

    Ok(())
}

fn leap_feb(year: u32) -> u32 {
    28 + (year % 4 == 0 && (year % 100 != 0 || (year % 100 == 0 && year % 400 == 0))) as u32
}
