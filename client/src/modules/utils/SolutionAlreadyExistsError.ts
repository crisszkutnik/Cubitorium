export class SolutionAlreadyExistsError extends Error {
  constructor() {
    const msg = 'Solution already exists';
    super(msg);
    this.message = msg;
    this.name = 'SolutionAlreadyExists';
  }
}
