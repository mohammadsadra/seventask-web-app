import {ParameterDTO} from '../history/ParameterDTO';

export class ActivityLogDTO {
  public message;
  public time: Date;
  public parameters: Array<ParameterDTO>;

  constructor(
    message,
    time: Date,
    parameters: Array<ParameterDTO>
  ) {
    this.message = message;
    this.time = time;
    this.parameters = parameters;
  }
}
