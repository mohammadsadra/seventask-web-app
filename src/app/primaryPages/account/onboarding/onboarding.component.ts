import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SetNickNameDTO} from '../../../DTOs/account/SetNickNameDTO';
import {AccountService} from '../../../services/accountService/account.service';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../services/localStorageService/local-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageCropComponent} from '../../sharedComponents/imageCrop/image-crop.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {SettingsService} from '../../../services/settingsService/settings.service';
import { UserInformationDTO } from 'src/app/DTOs/account/UserInformation';
import * as amplitude from "@amplitude/analytics-browser";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  @Input() email: string;
  @Input() ssoPhotoUrl = null;
  @Input() setNickNameSecurityStamp: string;
  @Input() setProfileImageSecurityStamp: string;
  public signInForm: FormGroup;
  croppedImage: any = '';
  imageForUpload: any;
  returnUrl = '';
  redirectToReturnURL = false;
  pressedSubmitButton = false;

  constructor(private accountService: AccountService,
              private jwtTokenService: JWTTokenService,
              private settingsService: SettingsService,
              private router: Router,
              private localStorageService: LocalStorageService,
              public dialog: MatDialog,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    amplitude.track('on_boarding_view');
    const indexOfReturnUrl = location.href.indexOf('returnUrl');
    if (indexOfReturnUrl > 0) {
      const returnUrl = location.href.substr(indexOfReturnUrl).replace('returnUrl=', '');
      if (returnUrl.indexOf('signIn') == -1) {
        this.redirectToReturnURL = true;
        this.returnUrl = returnUrl;
      }
    }
    this.signInForm = new FormGroup({
      NickName: new FormControl(
        null,
        [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)])
    });

    if (this.ssoPhotoUrl) {
      this.getBase64ImageFromUrl(this.ssoPhotoUrl)
        .then(result => {
          const file = this.createBlobImageFile(result);
          this.imageForUpload = file;
          this.croppedImage = result;
        });
    }
  }

  async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  submitSignInForm() {
    amplitude.track('enjoy_seventask_click');
    this.pressedSubmitButton = true;
    const setNickNameDTO = new SetNickNameDTO(
      this.signInForm.controls.NickName.value,
      this.email,
      this.setNickNameSecurityStamp
    );

    this.accountService.setNickName(setNickNameDTO).subscribe(async result => {

      if (this.imageForUpload) {
        await this.uploadProfileImage(this.imageForUpload);
      }

      this.localStorageService.set('showTutorial', 'true');

      this.jwtTokenService.setToken(result.value.token);
      this.jwtTokenService.decodeToken();
      //
      this.localStorageService.set('userToken', result.value.token);
      this.localStorageService.set('refreshToken', result.value.refreshToken);
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
        SettingsService.updateSettingsInLocalStorage(settings);
        if (this.redirectToReturnURL) {
          window.location.replace(decodeURIComponent(this.returnUrl));
          const userInfo: UserInformationDTO = {
            ip: (await this.accountService.getIPAddress())['ip'],
            browser: this.accountService.getBrowserName(),
            operatingSystem: this.accountService.getOperatingSystem(),
            timeZone: this.accountService.getTimezone(),
            device: 1
          }
          this.accountService.setUserInformation(userInfo).subscribe(res => {});
        } else {
          this.router.navigate(['/kanban']);
          const userInfo: UserInformationDTO = {
            ip: (await this.accountService.getIPAddress())['ip'],
            browser: this.accountService.getBrowserName(),
            operatingSystem: this.accountService.getOperatingSystem(),
            timeZone: this.accountService.getTimezone(),
            device: 1
          }
          this.accountService.setUserInformation(userInfo).subscribe(res => {});
        }
        amplitude.track('enjoy_seventask_end');
      });
      // this.router.navigate(['']);
    }, error => {
    });

  }

  addPhoto() {
    // $('#profileImageUpload').click();
    const imageCropperDialog = this.dialog.open(ImageCropComponent, {
      data: {
        imageSource: {
          imageForPreview: '',
          imageForUpload: File
        },
        croppedImage: ''
      },
    });

    imageCropperDialog.afterClosed().subscribe(result => {
      this.imageForUpload = result.imageSource.imageForUpload;
      this.croppedImage = result.imageSource.imageForPreview;
    });
  }

  onImageCrop(image: any) {
    this.croppedImage = image;
  }

  async uploadProfileImage(imageForUpload) {
    const endpoint = '/en-US/account/uploadProfileImage';
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('securityStamp', this.setProfileImageSecurityStamp);
    formData.append('file', imageForUpload, imageForUpload.name);
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    const request = this.http.put(endpoint, formData, {headers: headers});
    request.subscribe(result => {
    }, error => {
    });
  }

  createBlobImageFile(imageContent): File {
    imageContent = imageContent.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    let ssoImageFile;
    this.dataURItoBlob(imageContent).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName = this.generateName();
      const imageFile: File = new File([imageBlob], imageName, {
        type: 'image/jpeg'
      });
      ssoImageFile = imageFile;
    });
    return ssoImageFile;
  }

  /**Method to Generate a Name for the Image */
  generateName(): string {
    const date: number = new Date().valueOf();
    let text = '';
    const possibleText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + '.' + text + '.jpeg';
  }

  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], {type: 'image/jpeg'});
      observer.next(blob);
      observer.complete();
    });
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
