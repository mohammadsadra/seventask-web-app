export class BaseResponseModel {
  status: string;
  value: object;
  message: string;
  hasError: boolean;
  errors: [string];
}
