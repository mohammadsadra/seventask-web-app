import {BaseResponseModel} from './BaseResponseModel';

export class LoginResponseModel extends BaseResponseModel {
  value: {
    token: string,
    refreshToken: string;
    validTo: Date
  };
}
