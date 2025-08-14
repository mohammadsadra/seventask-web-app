import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {SsoDTO} from '../../../DTOs/account/SsoDTO';
import {AccountService} from '../../../services/accountService/account.service';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {LanguageService} from '../../../services/languageService/language.service';
import {LoginRegisterResponseModel} from '../../../DTOs/responseModel/LoginRegisterResponseModel';
import { DataService } from 'src/app/services/dataService/data.service';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit, OnDestroy {

  user: SocialUser;
  loggedIn: boolean;
  // when parent component want to call sso google signIn,
  // can use this eventListener and call emit() in parent to trigger subscribe() here.
  @Input() eventListener: any;
  @Output() onSignedIn = new EventEmitter<{ loginRegisterResponseModel: LoginRegisterResponseModel, socialUser: SocialUser }>();

  constructor(private authService: SocialAuthService,
              private accountService: AccountService,
              private dataService: DataService,
              private localStorageService: LocalStorageService,
              private jwtTokenService: JWTTokenService,
              private router: Router,
              private languageService: LanguageService) {
  }

  ngOnInit() {
    this.eventListener.subscribe(res => {
      this.signInWithGoogle();
    });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        const ssoData = new SsoDTO('Google', user.idToken);
        this.accountService.sso(ssoData).subscribe(res => {
          this.onSignedIn.emit({loginRegisterResponseModel: res, socialUser: user});
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy(): void {
      this.signOutBySSO();
  }


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public signOutBySSO(): void {
    this.user = null;
    this.loggedIn = false;
    this.authService.signOut().catch(() => {});
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
