export class SignInUserDTO {
  public Email: string;
  public Password: string;
  constructor(
    Email: string,
    Password: string
  ) {
    this.Email = Email;
    this.Password = Password;
  }
}
