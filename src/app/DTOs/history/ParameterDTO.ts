export class ParameterDTO {
  public parameterType: number;
  public parameterBody: string;

  constructor(
    parameterType: number,
    parameterBody: string
  ) {
    this.parameterType = parameterType;
    this.parameterBody = parameterBody;
  }
}
