export class ChangePasswordDTO {
  public lastPassword: string;
  public newPassword: string;
  constructor(
    lastPassword: string,
    newPassword: string
  ) {
    this.lastPassword = lastPassword;
    this.newPassword = newPassword;
  }
}
