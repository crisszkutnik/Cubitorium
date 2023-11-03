export class TooManyPendingTransactions extends Error {
  constructor() {
    const msg = 'Too many pending transactions. Save/clear to add more.';
    super(msg);
    this.message = msg;
    this.name = 'TooManyPendingTransactions';
  }
}
