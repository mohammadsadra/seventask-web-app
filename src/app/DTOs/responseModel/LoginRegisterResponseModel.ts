import {BaseResponseModel} from './BaseResponseModel';
import {TokensDTO} from '../account/TokensDTO';

export class LoginRegisterResponseModel extends BaseResponseModel {
  value: {
    emailConfirmed: boolean;
    hasNickName: boolean;
    nickNameSecurityStamp: string;
    profileImageSecurityStamp: string;
    jwtToken: TokensDTO
  };
}
