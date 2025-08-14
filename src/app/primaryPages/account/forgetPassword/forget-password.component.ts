import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ForgetPasswordUserDTO} from '../../../DTOs/account/ForgetPasswordUserDTO';
import {AccountService} from 'src/app/services/accountService/account.service';
import {ResetPasswordDTO} from '../../../DTOs/account/ResetPasswordDTO';
import {Router} from '@angular/router';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {SendConfirmEmailDTO} from '../../../DTOs/account/SendConfirmEmailDTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {fadeInOutAnimation} from '../../../../animations/animations';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ForgetPasswordComponent implements OnInit {
  @ViewChild('sweetAlert')
  public readonly sweetAlert!: SwalComponent;

  logo = '/assets/images/logo.png';
  forgetPasswordForm: FormGroup;
  emailSent = false;
  hide = false;
  public config = {leftTime: 0, format: 'm:s'};
  changePassButtonPushed = false;
  sendingEmail = false;
  recoverIconRotateDeg = 0;
  recoverIconRotateSpeed = 10;
  textDirection = TextDirectionController.getTextDirection();


  constructor(private _formBuilder: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private snackBar: MatSnackBar,
              public translateService: TranslateService) {
  }

  ngOnInit() {
    amplitude.track('forget_password_view');
    this.forgetPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      validationCode: ['', [Validators.required]],
    });
    this.rotateRecoverIcon();
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  rotateRecoverIcon() {
    this.recoverIconRotateDeg += this.recoverIconRotateSpeed;
    if (this.recoverIconRotateSpeed > 1) {
      this.recoverIconRotateSpeed -= 0.05;
    }
    document.getElementById('recoverIconId').style.transform = 'rotate(' + this.recoverIconRotateDeg + 'deg)';
    setTimeout(() => this.rotateRecoverIcon(), 10);
  }

  submitForgetPasswordForm() {
    this.recoverIconRotateSpeed = 10;
    this.getEmailTimeWait();
    this.sendingEmail = true;
    this.hide = true;
    const forgetPasswordData = new ForgetPasswordUserDTO(
      this.forgetPasswordForm.controls.email.value
    );
    this.accountService.forgetPassword(forgetPasswordData).subscribe(async res => {
      this.emailSent = true;
      this.sendingEmail = false;
      this.openSnackBar(await this.translateService.get('Snackbar.confirmationSent').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
    }, async err => {
      this.sendingEmail = false;
      this.emailSent = false;
      this.hide = false;
      await this.showError(err);
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  changePassword() {
    this.changePassButtonPushed = true;
    this.recoverIconRotateSpeed = 10;
    if (this.emailSent) {
      const resetPasswordData = new ResetPasswordDTO(
        this.forgetPasswordForm.controls.email.value,
        this.forgetPasswordForm.controls.newPassword.value,
        this.forgetPasswordForm.controls.validationCode.value,
      );
      this.accountService.resetPassword(resetPasswordData).subscribe(res => {
        this.changePassButtonPushed = false;
        if (res.status === 'Success') {
          this.router.navigate(['/signIn']);
        }
      }, async err => {
        this.changePassButtonPushed = false;
        await this.showError(err);
      });
    }
  }

  async showError(err) {
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
      await this.delay(4000);
    }
  }

  getEmailTimeWait() {
    this.accountService.getEmailTimeWait().subscribe(res => {
      this.config.leftTime = +res * 60;
    });
  }

  resendConfirmEmail() {
    if (this.config.leftTime === 0) {
      this.getEmailTimeWait();
      const forgetPasswordData = new ForgetPasswordUserDTO(this.forgetPasswordForm.controls.email.value);
      this.accountService.forgetPassword(forgetPasswordData).subscribe(res => {
        // console.log(res);
        if (res.status === 'Success') {
        }
      }, err => {
        if (this.forgetPasswordForm.controls.email.value == null) {
        } else {
        }
      });
    }
  }

  handleEvent(event) {
    if (event.action === 'done') {
      this.config.leftTime = 0;
    }
  }

}
