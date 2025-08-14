import {Injectable} from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {UserDTO} from '../../DTOs/user/UserDTO';
import {JwtTokenDTO} from '../../DTOs/account/JwtTokenDTO';

const USER_TOKEN = 'userToken';
const REFRESH_TOKEN = 'refreshToken';

@Injectable()
export class JWTTokenService {

  jwtToken: string = localStorage.getItem(USER_TOKEN);
  refreshToken: string = localStorage.getItem(REFRESH_TOKEN);
  decodedToken: { [key: string]: string };

  constructor() {
  }

  setToken(token: string) {
    this.jwtToken = token;
    localStorage.setItem(USER_TOKEN, token);
  }

  getToken(): string {
    return localStorage.getItem(USER_TOKEN);
  }

  removeToken(): void {
    localStorage.removeItem(USER_TOKEN);
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwtDecode(this.jwtToken);
    }
  }

  getDecodedToken() {
    return jwtDecode(this.jwtToken);
  }

  getCurrentUserId() {
    const user = jwtDecode(this.jwtToken) as JwtTokenDTO;
    return user.UserId;
  }

  getCurrentUser() {
    const user = jwtDecode(this.jwtToken) as JwtTokenDTO;
    return new UserDTO(user.NickName, user.UserId, user.UserProfileImageId);
  }

  getCurrentUserRoles() {
    const user = jwtDecode(this.jwtToken) as JwtTokenDTO;
    return user.Roles;
  }

  isUserBeta() {
    const user = jwtDecode(this.jwtToken) as JwtTokenDTO;
    return user.Roles.includes('BetaUser');
  }

  getUserProfileImageId() {
    this.decodeToken();
    return this.decodedToken ? (this.decodedToken.UserProfileImageId ? this.decodedToken.UserProfileImageId : null) : null;
  }

  getUserNickName() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.NickName : null;
  }

  getUserId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.UserId : null;
  }

  getEmailId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.UserEmail : null;
  }

  getExpiryTime() {
    this.decodeToken();
    // console.log(this.decodedToken.exp);
    return this.decodedToken ? +this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();
    // console.log(expiryTime);
    if (expiryTime) {
      // console.log((1000 * expiryTime) - (new Date()).getTime());
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }

  // getExpiryTimeLen(): number {
  //   const expiryTime: number = this.getExpiryTime();
  //   console.log(expiryTime);
  //   console.log((new Date()).getTime());
  //   console.log(((1000 * expiryTime) - (new Date()).getTime()) - 5000);
  //   return ((1000 * expiryTime) - (new Date()).getTime()) - 5000;
  // }
}
