import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {DomainName} from './PathTools';
import {Injectable} from '@angular/core';
import {AccountService} from '../services/accountService/account.service';
import {RefreshTokenDTO} from '../DTOs/account/refreshTokenDTO';
import {catchError, switchMap} from 'rxjs/operators';
import { map, filter, take } from 'rxjs/operators';
import { JWTTokenService } from '../services/accountService/jwttoken.service';
import { Router } from '@angular/router';
import { DataService } from '../services/dataService/data.service';

@Injectable()
export class SeventaskInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService,
              private jwtService: JWTTokenService,
              private dataService: DataService,
              private router: Router) {
        this.dataService.refreshingTokenObserable.subscribe((bool: boolean) => {
          this.isRefreshing = bool;
        });
  }

  isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const endPoint = request.url.split('/')[request.url.split('/').length - 1];
    return next.handle(this.addHeader(request)).pipe(catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && endPoint !== 'loginRegister') {
          if (!this.isRefreshing) {
            if (!localStorage.getItem('userToken') || !localStorage.getItem('refreshToken')) {
              this.router.navigate(['/signIn']);
              return of(null);
            }
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            this.dataService.isRefreshingToken(true);
            return this.accountService.refreshToken(
              new RefreshTokenDTO(localStorage.getItem('userToken'), localStorage.getItem('refreshToken'))
            ).pipe(
                  switchMap((token: any) => {
                      this.dataService.isRefreshingToken(false);
                      this.isRefreshing = false;
                      token = token.value;
                      if (token && token.token && token.refreshToken) {
                          this.jwtService.setToken(token.token);
                          this.jwtService.setRefreshToken(token.refreshToken);
                          localStorage.setItem('tokenValidTo', token.validTo.toString());
                          this.refreshTokenSubject.next(token.token);
                      }
                      return next.handle(this.addHeader(request));
                  }));
          } else {
            return this.refreshTokenSubject.pipe(
                filter(token => (token != null && token != undefined)),
                take(1),
                switchMap(() => {
                    return next.handle(this.addHeader(request));
                }));
        }
        } else if ((error.status === 400 || error.status === 500) && endPoint === 'refresh') {
            console.log('The access token could not be refreshed');
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('settingsData');
            localStorage.removeItem('kanbanSettings');
            localStorage.removeItem('sortSettings');
            localStorage.removeItem('kanbanViewSettings');
            localStorage.removeItem('tokenValidTo');
            this.router.navigate(['/signIn'], {queryParams: {returnUrl: location.href}});
            return of(null);
        } else {
          return next.handle(this.addHeader(request));
        }
      }
    }));
  }

  private addHeader(request: HttpRequest<any>) {
    const endPoint = request.url.split('/')[request.url.split('/').length - 1];

    return endPoint === 'refresh' ? request.clone({
      url: request.url.search('assets/i18n') === 1 ? location.protocol + '//' + location.host + request.url : DomainName + request.url
    }) : request.clone({
      url: request.url.search('assets/i18n') === 1 ? location.protocol + '//' + location.host + request.url : DomainName + request.url,
      headers: request.headers.append('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
    });
  }

}
