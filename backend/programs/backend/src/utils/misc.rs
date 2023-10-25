use std::cell::RefMut;

use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

use crate::{
    error::{TreasuryError, UserInfoError},
    UserInfo,
};

/// Calls a realloc and transfers enough rent. Meant for non-PDA funders.
pub fn realloc_with_rent<'info>(
    new_size: usize,
    acc: &mut AccountInfo<'info>,
    funder: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
) -> Result<()> {
    let new_minimum_balance = Rent::get()?.minimum_balance(new_size);
    let lamports_diff = new_minimum_balance.saturating_sub(acc.lamports());

    invoke(
        &system_instruction::transfer(funder.key, acc.key, lamports_diff),
        &[funder.clone(), acc.clone(), system_program.clone()],
    )?;

    acc.realloc(new_size as usize, false)?;

    Ok(())
}

/// Util function to tidy up instructions just a bit
/// Treasury pays remaining rent and refunds an amount to the user.
pub fn pay_rent_and_refund_to_user<'a, 'info>(
    refund_amount: u64,
    extra_amount: u64,
    max_fund_limit: u64,
    mut treasury_lamports: RefMut<&'a mut u64>,
    mut pda_lamports: RefMut<&'a mut u64>,
    mut user_lamports: RefMut<&'a mut u64>,
    user_profile: &mut Account<UserInfo>,
) -> Result<()> {
    // Refund lamports if user has some quota left
    if user_profile.sol_funded + refund_amount < max_fund_limit {
        require!(
            **treasury_lamports >= refund_amount,
            TreasuryError::TreasuryNeedsFunds
        );

        **treasury_lamports -= refund_amount;
        **user_lamports += refund_amount;
        user_profile.sol_funded += refund_amount;
    }

    // Transfer extra rent
    require!(
        **treasury_lamports >= extra_amount,
        TreasuryError::TreasuryNeedsFunds
    );
    **treasury_lamports -= extra_amount;
    **pda_lamports += extra_amount;

    Ok(())
}

/// Asserts that date matches yyyy-mm-dd format (Regex crate didn't work...)
pub fn check_date(date: &str) -> Result<()> {
    let year = date[0..=3]
        .parse::<u32>()
        .map_err(|_| UserInfoError::WrongDateFormat)?;
    let month = date[5..=6]
        .parse::<u32>()
        .map_err(|_| UserInfoError::WrongDateFormat)?;
    let day = date[8..=9]
        .parse::<u32>()
        .map_err(|_| UserInfoError::WrongDateFormat)?;

    if !(date.len() == 10
        && month <= 12
        && day <= [31, leap_feb(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month as usize - 1]
        && date.chars().nth(4).unwrap() == '-'
        && date.chars().nth(7).unwrap() == '-')
    {
        err!(UserInfoError::WrongDateFormat)?
    }

    Ok(())
}

fn leap_feb(year: u32) -> u32 {
    28 + (year % 4 == 0 && (year % 100 != 0 || (year % 100 == 0 && year % 400 == 0))) as u32
}
