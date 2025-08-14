import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignInUserDTO} from '../../../DTOs/account/SignInUserDTO';
import {SendConfirmEmailDTO} from '../../../DTOs/account/SendConfirmEmailDTO';
import {AccountService} from '../../../services/accountService/account.service';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {Router} from '@angular/router';
import {LanguageService} from '../../../services/languageService/language.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginRegisterResponseModel} from '../../../DTOs/responseModel/LoginRegisterResponseModel';
import {SocialUser} from 'angularx-social-login';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {AppComponent} from '../../../app.component';
import {DirectionService} from '../../../services/directionService/direction.service';
import {SettingsService} from '../../../services/settingsService/settings.service';
import {fadeInOutAnimation} from '../../../../animations/animations';
import {UserInformationDTO} from 'src/app/DTOs/account/UserInformation';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInOutAnimation]
})
export class LoginComponent implements OnInit {

  constructor(private accountService: AccountService,
              private jwtTokenService: JWTTokenService,
              private localStorageService: LocalStorageService,
              private languageService: LanguageService,
              private settingsService: SettingsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private directionService: DirectionService,
              public translate: TranslateService,
              public translateService: TranslateService) {
  }

  @ViewChild('sweetAlert')
  public readonly sweetAlert!: SwalComponent;
  public signInForm: FormGroup;
  public isSignedIn = false;
  public hasRequestedSignIn = false;
  public needConfirm = false;
  public emailSent = false;
  public getProfile = false;
  public emailConfirmed = false;
  public setNickNameSecurityStamp: string;
  public setProfileImageSecurityStamp: string;
  public ssoEvent = new EventEmitter<string>();
  public ssoImageUrl = null;
  returnUrl = '';
  redirectToReturnURL = false;
  hidePassword = true;
  language = '';
  isChangeLanguage = false;
  changedLanguage = true;
  textDirection = TextDirectionController.getTextDirection();

  ngOnInit(): void {
    amplitude.track('login_page_view');
    const indexOfReturnUrl = location.href.indexOf('returnUrl');
    if (indexOfReturnUrl > 0) {
      const returnUrl = location.href.substr(indexOfReturnUrl).replace('returnUrl=', '');
      if (returnUrl.indexOf('signIn') == -1) {
        this.redirectToReturnURL = true;
        this.returnUrl = returnUrl;
      }
    }
    this.signInForm = new FormGroup({
      UsernameOrEmail: new FormControl(null, [Validators.required, Validators.email]),
      Password: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)])
    });

    if (localStorage.getItem('languageCode') === 'en-US') {
      this.language = 'English';
      this.changeLanguage('en-US').then();
    } else if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.language = 'فارسی';
      this.changeLanguage('fa-IR').then();
    } else {
      this.localStorageService.set('languageCode', 'en-US');
      this.language = 'English';
      this.changeLanguage('en-US').then();
    }
  }

  async changeLanguage(languageCode: string) {
    amplitude.track('change-language_click');
    this.changedLanguage = true;
    await this.delay(400);
    this.isChangeLanguage = false;
    this.localStorageService.set('languageCode', languageCode);
    if (languageCode === 'en-US') {
      this.language = 'English';
      this.translate.use('en');
    } else if (languageCode === 'fa-IR') {
      this.language = 'فارسی';
      this.translate.use('fa');
    }
    TextDirectionController.changeDirection();
    this.directionService.changeRotation(TextDirectionController.iconRotationDegree);
    AppComponent.textDirection = TextDirectionController.textDirection;
    this.changedLanguage = false;
  }

  toggleChangeLanguageState() {
    if (this.isChangeLanguage) {
      this.isChangeLanguage = false;
    } else {
      this.isChangeLanguage = true;
    }
  }

  onSsoSignIn(event: { loginRegisterResponseModel: LoginRegisterResponseModel, socialUser: SocialUser }) {
    this.handleLoginRegisterResponse(event.loginRegisterResponseModel);
    this.signInForm.controls.UsernameOrEmail.setValue(event.socialUser.email);
    this.ssoImageUrl = event.socialUser.photoUrl;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  onEmailConfirm(value) {
    this.emailConfirmed = true;
    this.getProfile = true;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ssoClick() {
    amplitude.track('login_by_google_click');
    this.ssoEvent.emit('google')
  }

  submitSignInForm() {
    amplitude.track('login_register_click');
    this.hasRequestedSignIn = true;
    const signInData = new SignInUserDTO(
      this.signInForm.controls.UsernameOrEmail.value,
      this.signInForm.controls.Password.value
    );

    this.accountService.loginRegister(signInData).subscribe(res => {
      // this.hasRequestedSignIn = false;
      this.handleLoginRegisterResponse(res);
    }, async err => {
      this.hasRequestedSignIn = false;
      const errors = [];
      if (err.error) {
        if (err.error.errors) {
          err.error.errors.forEach(error => {
            errors.push(error);
          });
        } else {
          errors.push('Something Went Wrong.');
        }
      } else {
        errors.push('Something Went Wrong.');
      }
      for (let i = 0; i < errors.length; i++) {
        this.openSnackBar(errors[i].toString(), await this.translateService.get('Buttons.gotIt').toPromise());
        await this.delay(2000);
      }
    }, () => {
    });
  }

  private handleLoginRegisterResponse(response: LoginRegisterResponseModel) {
    this.setNickNameSecurityStamp = response.value.nickNameSecurityStamp;
    this.setProfileImageSecurityStamp = response.value.profileImageSecurityStamp;
    if (!response.value.emailConfirmed) {
      this.needConfirm = true;
      const sendConfirmEmailData = new SendConfirmEmailDTO(this.signInForm.controls.UsernameOrEmail.value);
      this.accountService.sendConfirmEmail(sendConfirmEmailData).subscribe(sendEmailResult => {
        this.emailSent = true;
      }, sendEmailError => {
        this.hasRequestedSignIn = false;
      });
    } else if (!response.value.hasNickName) {
      this.getProfile = true;
    } else if (response.value.jwtToken) {
      this.localStorageService.set('showTutorial', 'false');

      this.localStorageService.set('tokenValidTo', response.value.jwtToken.validTo.toString());

      this.jwtTokenService.setToken(response.value.jwtToken.token);
      this.jwtTokenService.decodeToken();
      //
      this.localStorageService.set('userToken', response.value.jwtToken.token);
      this.localStorageService.set('refreshToken', response.value.jwtToken.refreshToken);
      // Storing settings in local storage.
      this.settingsService.getSettings().subscribe(async settings => {
        if (settings.themeColor === '') {
          settings.themeColor = '4278DF';
        }
        const themeColor = '#' + settings.themeColor;
        document.documentElement.style.setProperty('--theme-color', themeColor);
        document.documentElement.style.setProperty('--theme-color-opacity-version',
          this.hexToRgb(themeColor).r + ',' +
          this.hexToRgb(themeColor).g + ',' +
          this.hexToRgb(themeColor).b);
        this.hasRequestedSignIn = false;
        SettingsService.updateSettingsInLocalStorage(settings);
        if (this.redirectToReturnURL) {
          window.location.replace(decodeURIComponent(this.returnUrl));
          const userInfo: UserInformationDTO = {
            ip: (await this.accountService.getIPAddress())['ip'],
            browser: this.accountService.getBrowserName(),
            operatingSystem: this.accountService.getOperatingSystem(),
            timeZone: this.accountService.getTimezone(),
            device: 1
          };
          this.accountService.setUserInformation(userInfo).subscribe(res => {
          });
        } else {
          this.router.navigate(['/kanban']);
          const userInfo: UserInformationDTO = {
            ip: (await this.accountService.getIPAddress())['ip'],
            browser: this.accountService.getBrowserName(),
            operatingSystem: this.accountService.getOperatingSystem(),
            timeZone: this.accountService.getTimezone(),
            device: 1
          };
          this.accountService.setUserInformation(userInfo).subscribe(res => {
          });
        }
      });
    }
  }

  private hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}
