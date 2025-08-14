export class UserInformationDTO {
    public ip: string;
    public browser: string;
    public operatingSystem: string;
    public timeZone: string;
    public device: number;
  
    constructor(
      ip: string,
      browser: string,
      operatingSystem: string,
      timeZone: string,
      device: number
    ) {
      this.ip = ip;
      this.browser = browser,
      this.operatingSystem = operatingSystem;
      this.timeZone = timeZone;
      this.device = device;
    }
  }
  