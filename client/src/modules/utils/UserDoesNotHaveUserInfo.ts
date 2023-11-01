export class UserDoesNotHaveUserInfo extends Error {
  constructor() {
    const msg = 'User does not have user info';
    super(msg);
    this.message = msg;
    this.name = 'UserDoesNotHaveUserInfo';
  }
}
