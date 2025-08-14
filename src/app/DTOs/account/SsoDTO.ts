export class SsoDTO {
  public providerName: string;
  public token: string;
  value: string;

  constructor(
    providerName: string,
    token: string,
  ) {
    this.providerName = providerName;
    this.token = token;
  }
}
