import DateTimeFormat = Intl.DateTimeFormat;

export interface ISignInUser {
  status: string;
  value: {
    token: string;
    validTo: Date;
  };
  message: string;
  hasError: boolean;
}
