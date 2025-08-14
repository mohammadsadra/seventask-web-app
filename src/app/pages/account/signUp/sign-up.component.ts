import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SignUpUserDTO} from '../../../DTOs/account/SignUpUserDTO';
import {AccountService} from 'src/app/services/accountService/account.service';
import {SendConfirmEmailDTO} from '../../../DTOs/account/SendConfirmEmailDTO';
import {Router} from '@angular/router';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @ViewChild('sweetAlert')
  public readonly sweetAlert!: SwalComponent;
  hide = true;
  logo = '/assets/images/logo.png';
  signUpSuccessful = false;
  emailSent = false;
  timeout = 0;
  previousUserName = '';
  previousEmail = '';


  signUpForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private jwtTokenService: JWTTokenService,
              private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.signUpForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^((?!\\s|@).)*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }


  submitSignUpForm() {
    const signUpData = new SignUpUserDTO(
      this.signUpForm.controls.username.value,
      this.signUpForm.controls.email.value,
      this.signUpForm.controls.password.value,
    );
    const sendConfirmEmailData = new SendConfirmEmailDTO(this.signUpForm.controls.email.value);
    // this.accountService.signUp(signUpData).subscribe(res => {
    //   console.log(res);
    //   if (res.status === 'Success') {
    //     this.signUpSuccessful = true;
    //     this.accountService.sendConfirmEmail(sendConfirmEmailData).subscribe(response => {
    //       console.log(response);
    //       if (response.status) {
    //         this.emailSent = true;
    //       }
    //     });
    //     // this.signUpForm.reset();
    //   }
    // }, err => {
    //   console.log(err.error);
    //   if (err.error.status === 'Error') {
    //     if (err.error.errors[0] === 'There is a user with this email.') {
    //       this.sweetAlert.title = 'There is a user with this email.';
    //       this.sweetAlert.text = 'You can signIn';
    //       this.sweetAlert.fire();
    //       this.router.navigate(['/signIn']);
    //     } else {
    //       this.sweetAlert.fire();
    //     }
    //   }
    // });
  }


  private onUsernameSearch(event: any) {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = +setTimeout(function () {
      if (this.previousUserName !== event.target.value && event.target.value !== '') {
        $this.executeListingUsernames(event.target.value);
      }
      this.previousUserName = event.target.value;

    }, 700);
  }

  private onEmailSearch(event: any) {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = +setTimeout(function () {
      if (this.previousEmail !== event.target.value && event.target.value !== '') {
        $this.executeListingEmails(event.target.value);
      }
      this.previousEmail = event.target.value;

    }, 700);
  }

  private executeListingUsernames(value: string) {
    console.log(value);
  }

  private executeListingEmails(value: string) {
    console.log(value);
  }
}
