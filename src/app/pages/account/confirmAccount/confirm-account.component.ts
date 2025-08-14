import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../services/accountService/account.service';
import {ConfirmEmailDTO} from '../../../DTOs/account/ConfirmEmailDTO';
import {SignInUserDTO} from '../../../DTOs/account/SignInUserDTO';
import {Router} from '@angular/router';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {SendConfirmEmailDTO} from '../../../DTOs/account/SendConfirmEmailDTO';
import {BACKSPACE, DELETE, ESCAPE} from '@angular/cdk/keycodes';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})

export class ConfirmAccountComponent implements OnInit {
  @Input() email: string;
  @Input() password: string;
  @Output() emailConfirmEvent = new EventEmitter<boolean>();
  @ViewChild('verificationCodeInput') private verificationCodeInput: ElementRef;
  public confirmForm: FormGroup;
  public config = {leftTime: 0, format: 'mm:ss'};
  public apiCalled = false;
  public wrongCode = false;
  public correctCode = false;
  public emailTimeWait = 60;

  constructor(private _formBuilder: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private jwtTokenService: JWTTokenService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    amplitude.track('email_confirm_view');
    this.confirmForm = new FormGroup({
      VerificationCode: new FormControl()
    });
    this.getEmailTimeWait();
    $('#email-code-Id').focus();
  }

  restrictNumeric(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key) && event.keyCode !== DELETE && event.keyCode !== BACKSPACE) {
      return false;
    }
  }

  checkVerificationCodeForSubmit(event: any) {
    if (this.confirmForm.controls.VerificationCode.value) {
      if (this.confirmForm.controls.VerificationCode.value.toString().length === 4) {
        this.submitConfirmForm();
      }
    }
  }

  submitConfirmForm() {
    this.apiCalled = true;
    if (this.email) {
      const confirmEmailData = new ConfirmEmailDTO(this.email, this.confirmForm.controls.VerificationCode.value);
      this.accountService.confirmEmail(confirmEmailData).subscribe(res => {
        this.correctCode = true;
        this.apiCalled = false;
        setTimeout(() => {
          this.emailConfirmEvent.emit(true);
        }, 500);
        // this.emailConfirm.emit('true');
        // if (res.status === 'Success') {
        //   const signInData = new SignInUserDTO(
        //     this.email,
        //     this.password
        //   );
        //   this.accountService.signIn(signInData).subscribe(res2 => {
        //     if (res2.status === 'Success') {
        //       console.log(res2.value.token);
        //       this.jwtTokenService.setToken(res2.value.token);
        //       this.jwtTokenService.decodeToken();
        //       this.localStorageService.set('userToken', res2.value.token);
        //       this.localStorageService.set('refreshToken', res2.value.refreshToken);
        //       this.router.navigate(['/']);
        //     } else if (res2.status === 'Error') {
        //     }
        //   });
        //   this.router.navigate(['/signIn']);
        // }
      }, err => {
        this.apiCalled = false;
        this.wrongCode = true;
        setTimeout(() => this.resetWrongCode(), 1000);
        this.confirmForm.controls.VerificationCode.reset();
      });
    } else {
    }
  }

  checkCode() {
    amplitude.track('fake_check_email_verification_code_click');
  }

  resetWrongCode() {
    this.wrongCode = false;
  }

  resendConfirmEmail() {
    if (this.config.leftTime === 0) {
      this.setLeftTime(this.emailTimeWait);
      const sendConfirmEmailData = new SendConfirmEmailDTO(this.email);
      this.accountService.sendConfirmEmail(sendConfirmEmailData).subscribe(res => {
        if (res.status === 'Success') {
        }
      }, err => {
        if (this.confirmForm.controls.email.value == null) {
        } else {
        }
      });
    }
  }

  getEmailTimeWait() {
    this.accountService.getEmailTimeWait().subscribe(res => {
      this.setLeftTime(+res * 60);
    });
  }

  setLeftTime(timeInSecond: number) {
    this.config.leftTime = timeInSecond;
  }

  handleEvent(event) {
    if (event.action === 'done') {
      this.config.leftTime = 0;
    }
  }

}
