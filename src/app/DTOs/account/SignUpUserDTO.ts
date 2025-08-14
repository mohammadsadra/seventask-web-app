export class SignUpUserDTO {
  public Username: string;
  public Email: string;
  public Password: string;

  constructor(
    username: string,
    email: string,
    password: string
  ) {
    this.Username = username;
    this.Email = email;
    this.Password = password;

  }
}
