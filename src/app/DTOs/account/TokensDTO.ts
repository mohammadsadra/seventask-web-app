export class TokensDTO {
  public token: string;
  public refreshToken: string;
  public validTo: Date;

  constructor(
    token: string,
    refreshToken: string,
    validTo: Date
  ) {
    this.refreshToken = refreshToken;
    this.token = token;
    this.validTo = validTo;
  }
}
