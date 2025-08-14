import {ParameterDTO} from './ParameterDTO';

export class HistoryDTO {
  public message: string;
  public time: Date;
  public parameters: Array<ParameterDTO>;

  constructor(
    message: string,
    time: Date,
    parameters: Array<ParameterDTO>
  ) {
    this.message = message;
    this.time = time;
    this.parameters = parameters;
  }
}
