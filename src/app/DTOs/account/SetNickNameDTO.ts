export class SetNickNameDTO {
  public nickName: string;
  public email: string;
  public nickNameSecurityStamp: string;

  constructor(
    nickName: string,
    email: string,
    nickNameSecurityStamp: string
  ) {
    this.nickName = nickName;
    this.email = email;
    this.nickNameSecurityStamp = nickNameSecurityStamp;
  }
}
