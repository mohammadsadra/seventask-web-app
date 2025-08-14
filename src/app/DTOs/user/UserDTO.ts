export class UserDTO {
  public nickName: string;
  public userId: string;
  public profileImageGuid: string;

  constructor(
    nickName: string,
    userId: string,
    profileImageGuid: string
  ) {
    this.nickName = nickName;
    this.userId = userId;
    this.profileImageGuid = profileImageGuid;
  }
}
