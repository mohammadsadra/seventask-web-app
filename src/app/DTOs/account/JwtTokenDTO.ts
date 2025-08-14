export class JwtTokenDTO {
  public UserEmail: string;
  public NickName: string;
  public UserId: string;
  public UserProfileImageId: string;
  public Roles: string;
  public exp: string;
  public iss: string;
  public aud: string;

  constructor(
    UserEmail: string,
    NickName: string,
    UserId: string,
    UserProfileImageId: string,
    Roles: string,
    exp: string,
    iss: string,
    aud: string,
  ) {
    this.UserEmail = UserEmail;
    this.NickName = NickName;
    this.UserId = UserId;
    this.UserProfileImageId = UserProfileImageId;
    this.Roles = Roles;
    this.exp = exp;
    this.iss = iss;
    this.aud = aud;
  }
}
