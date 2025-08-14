export class PlanInfoDTO {

    public id: number;
    public name: string;
    public users: number;
    public projects: number;
    public sizeInMb: number;
  
    constructor(obj: Object = {}) {
      Object.assign(this, obj);
    }
    
  }