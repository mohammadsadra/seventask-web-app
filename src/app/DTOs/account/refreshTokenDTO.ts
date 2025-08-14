export class RefreshTokenDTO {
  public token: string;
  public refreshToken: string;

  constructor(
    token: string,
    refreshToken: string,
  ) {
    this.refreshToken = refreshToken;
    this.token = token;
  }
}
