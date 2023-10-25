use anchor_lang::prelude::Result;

/// Trait to implement polymorphism for solution validation
pub trait Puzzle {
    fn compress_and_apply(&mut self, solution: &str) -> Result<Vec<u8>>;

    fn check_solved_for_set(&self, set: &str) -> Result<()>;
}
