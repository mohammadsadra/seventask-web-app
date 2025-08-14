import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignInUserDTO} from '../../../DTOs/account/SignInUserDTO';
import {AccountService} from '../../../services/accountService/account.service';
import {CookieService} from 'ngx-cookie-service';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {Router} from '@angular/router';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {SendConfirmEmailDTO} from '../../../DTOs/account/SendConfirmEmailDTO';
import {LanguageService} from '../../../services/languageService/language.service';
import {environment} from 'src/environments/environment';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  @ViewChild('sweetAlert')
  public readonly sweetAlert!: SwalComponent;
  public signInForm: FormGroup;
  public needConfirm = false;
  public emailSent = false;
  public isSignedIn = false;
  public hasRequestedSignIn = false;
  public email;
  hide = true;


  constructor(
    private accountService: AccountService,
    private cookieService: CookieService,
    private jwtTokenService: JWTTokenService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private languageService: LanguageService) {
  }

  ngOnInit() {

    this.signInForm = new FormGroup({
      UsernameOrEmail: new FormControl(null, [Validators.required, Validators.pattern('^((?!\\s).)*$')]),
      Password: new FormControl(null, [Validators.required]),
      RememberMe: new FormControl(),
    });

  }

  submitSignInForm() {
    this.hasRequestedSignIn = true;
    const signInData = new SignInUserDTO(
      this.signInForm.controls.UsernameOrEmail.value,
      this.signInForm.controls.Password.value
    );
  }


}
