use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

pub type ConfigCaseJson = Vec<CaseJson>;

#[derive(serde::Deserialize, serde::Serialize)]
pub struct CaseJson {
    pub set_name: String,
    pub case_names: Vec<String>,
}

#[account]
pub struct GlobalConfig {
    /// Supported sets stored in a JSON format
    /// 
    /// Example:
    /// 
    /// sets_json = [
    ///    {
    ///       set_name: 'F2L',
    ///       case_names: ['1', '2', '3'],
    ///    },
    ///    {
    ///       set_name: 'OLL',
    ///       case_names: ['Aa', 'Ab', 'E', 'F'],
    ///    },
    /// ],
    /// 
    pub sets_json: String,
}

impl GlobalConfig {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH;
}
