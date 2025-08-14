import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {SignInUserDTO} from '../../DTOs/account/SignInUserDTO';
import {SignUpUserDTO} from '../../DTOs/account/SignUpUserDTO';
import {ForgetPasswordUserDTO} from '../../DTOs/account/ForgetPasswordUserDTO';
import {SendConfirmEmailDTO} from '../../DTOs/account/SendConfirmEmailDTO';
import {ConfirmEmailDTO} from '../../DTOs/account/ConfirmEmailDTO';
import {ResetPasswordDTO} from '../../DTOs/account/ResetPasswordDTO';
import {LoginResponseModel} from '../../DTOs/responseModel/LoginResponseModel';
import {TokensDTO} from '../../DTOs/account/TokensDTO';
import {SsoDTO} from '../../DTOs/account/SsoDTO';
import {LoginRegisterResponseModel} from '../../DTOs/responseModel/LoginRegisterResponseModel';
import {SetNickNameDTO} from '../../DTOs/account/SetNickNameDTO';
import {ChangePasswordDTO} from '../../DTOs/account/ChangePasswordDTO';
import {RefreshTokenDTO} from '../../DTOs/account/refreshTokenDTO';
import {JWTTokenService} from './jwttoken.service';
import {catchError, map} from 'rxjs/operators';
import {DataService} from '../dataService/data.service';
import {UserInformationDTO} from 'src/app/DTOs/account/UserInformation';
import * as moment from 'moment';
import {GoogleCodeScopeModelDTO} from '../../DTOs/integration/GoogleCodeScopeModelDTO';
import {BaseResponseModel} from '../../DTOs/responseModel/BaseResponseModel';
import {GoogleConnectStatusDTO, GoogleConnectStatusResponseModel} from '../../DTOs/integration/GoogleConnectStatusDTO';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient,
              private dataService: DataService,
              private jwtTokenService: JWTTokenService) {
  }

  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  async getIPAddress() {
    return (await fetch('https://api.ipify.org/?format=json')).json();
  }

  getOperatingSystem() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Mac')) {
      return 'MacOS';
    } else if (userAgent.indexOf('Linux')) {
      return 'Linux';
    } else if (userAgent.indexOf('X11')) {
      return 'UNIX';
    } else if (userAgent.indexOf('Windows NT 10.0')) {
      return 'Windows 10';
    } else if (userAgent.indexOf('Windows NT 6.3')) {
      return 'Windows 8.1';
    } else if (userAgent.indexOf('Windows NT 6.2')) {
      return 'Windows 8';
    } else if (userAgent.indexOf('Windows NT 6.1')) {
      return 'Windows 7';
    } else if (userAgent.indexOf('Windows NT 6.0')) {
      return 'Windows Vista';
    } else if (userAgent.indexOf('Windows NT 5.1')) {
      return 'Windows XP';
    } else if (userAgent.indexOf('Windows NT 5.0')) {
      return 'Windows 2000';
    }
    return 'Unknown';
  }

  getTimezone() {
    return 'UTC' + moment.parseZone(new Date()).format('Z');
  }

  loginRegister(loginRegisterData: SignInUserDTO): Observable<LoginRegisterResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      // localStorage.setItem('languageCode', 'en-US');
      return this.http.post<LoginRegisterResponseModel>('/en-US/account/loginRegister', loginRegisterData);
    } else {
      return this.http.post<LoginRegisterResponseModel>('/' + localStorage.getItem('languageCode') +
        '/account/loginRegister', loginRegisterData);
    }
  }

  signOut(token: String): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<string>('/en-US/account/logOut', {Token: token});
    } else {
      return this.http.post<string>('/' + localStorage.getItem('languageCode') + '/account/logOut', {Token: token});
    }
  }

  setFirebaseToken(token: String): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<string>('/en-US/account/setFirebaseToken', {value: token});
    } else {
      return this.http.post<string>('/' + localStorage.getItem('languageCode') + '/account/setFirebaseToken', {value: token});
    }
  }

  forgetPassword(forgetPasswordData: ForgetPasswordUserDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/sendResetPassEmail', forgetPasswordData);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/sendResetPassEmail', forgetPasswordData);
    }
  }

  resetPassword(resetPasswordData: ResetPasswordDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/account/resetPassword', resetPasswordData);
    } else {
      return this.http.put<any>('/' + localStorage.getItem('languageCode') + '/account/resetPassword', resetPasswordData);
    }
  }

  sendConfirmEmail(sendConfirmEmailData: SendConfirmEmailDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/sendConfirmEmail', sendConfirmEmailData);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/sendConfirmEmail', sendConfirmEmailData);
    }
  }

  confirmEmail(ConfirmEmailData: ConfirmEmailDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/confirmEmail', ConfirmEmailData);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/confirmEmail', ConfirmEmailData);
    }
  }

  setUserInformation(userInformation: UserInformationDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/setUserInformation', userInformation);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/setUserInformation', userInformation);
    }
  }

  getEmailTimeWait(): any {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/account/getEmailTimeWait');
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/account/getEmailTimeWait');
    }
  }

  refreshToken(tokensData: RefreshTokenDTO): Observable<LoginResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/refresh', tokensData);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/refresh', tokensData);
    }
  }

  sso(ssoData: SsoDTO): Observable<LoginRegisterResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/account/sso', ssoData);
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/account/sso', ssoData);
    }
  }

  setNickName(setNickNameData: SetNickNameDTO): Observable<LoginResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      // localStorage.setItem('languageCode', 'en-US');
      return this.http.put<LoginResponseModel>('/en-US/account/setNickName', setNickNameData);
    } else {
      return this.http.put<LoginResponseModel>('/' + localStorage.getItem('languageCode') +
        '/account/setNickName', setNickNameData);
    }
  }

  updateNickName(newNickName: string): Observable<LoginResponseModel> {
    return this.http.put<LoginResponseModel>('/' + localStorage.getItem('languageCode') +
      '/account/updateNickName', {'value': newNickName});
  }

  changePassword(changePasswordDTO: ChangePasswordDTO): Observable<LoginResponseModel> {
    return this.http.put<LoginResponseModel>('/' + localStorage.getItem('languageCode') +
      '/account/changePassword', changePasswordDTO);
  }

  setGoogleCode(model: GoogleCodeScopeModelDTO): Observable<any> {
    return this.http.post<any>('/' + localStorage.getItem('languageCode') +
      '/account/setGoogleCode', model);
  }

  getGoogleConnectStatus(): Observable<GoogleConnectStatusResponseModel> {
    return this.http.get<any>('/' + localStorage.getItem('languageCode') +
      '/account/getGoogleConnectStatus');
  }

  isAuthenticated(): Observable<boolean> {
    const nowTime = new Date();
    const tokenValidTo = new Date(localStorage.getItem('tokenValidTo'));
    if (!localStorage.getItem('userToken')) {
      return of(false);
    }
    if (nowTime > tokenValidTo) {
      if (!localStorage.getItem('refreshToken')) {
        return of(false);
      }
      this.dataService.isRefreshingToken(true);
      const refreshToken = new RefreshTokenDTO(localStorage.getItem('userToken'), localStorage.getItem('refreshToken'));
      return this.refreshToken(refreshToken)
        .pipe(
          map(response => {
            if (response) {
              this.dataService.isRefreshingToken(false);
              if (response && response.value.token && response.value.refreshToken) {
                this.jwtTokenService.setToken(response.value.token);
                this.jwtTokenService.setRefreshToken(response.value.refreshToken);
                localStorage.setItem('tokenValidTo', response.value.validTo.toString());
              }
              return true;
            }
          }), catchError((err, caught) => {
            return of(false);
          })
        );
    } else {
      return of(true);
    }
  }
}
