export class MainResponseModel<T> {
  status: string;
  value: T;
  message: string;
  hasError: boolean;
  errors: [string];
}
