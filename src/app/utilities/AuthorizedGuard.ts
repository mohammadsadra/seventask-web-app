import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AccountService} from '../services/accountService/account.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(private accountService: AccountService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const expectedRole = next.data.expectedRole ? next.data.expectedRole : null;
    return this.accountService.isAuthenticated()
      .pipe(
        map(isAuth => {
          if (!isAuth) {
            this.router.navigate(['/signIn'], {queryParams: {returnUrl: location.href}});
            return false;
          } else {
            return true;
          }
        }),
        catchError((error, caught) => {
          return of(false);
        })
      );
  }
}
