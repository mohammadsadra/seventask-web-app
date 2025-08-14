export class TeamPlanInfoDTO {

  public teamBasePlanId: number;
  public users: number;
  public projects: number;
  public sizeInMb: number;
  public deltaUsers: number;
  public deltaProjects: number;
  public deltaSizeInMb: number;
  public validUntil: Date;
  public usedUsers: number;
  public usedProjects: number;
  public usedSizeInMb: number;
  public seatCount: number;

  constructor(obj: Object = {}) {
    Object.assign(this, obj);
  }
  
}