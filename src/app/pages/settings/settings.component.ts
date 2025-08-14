import {Component, Input, OnInit} from '@angular/core';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../services/languageService/language.service';
import {LocalStorageService} from '../../services/localStorageService/local-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DirectionService} from '../../services/directionService/direction.service';
import {DataService} from '../../services/dataService/data.service';
import {JWTTokenService} from '../../services/accountService/jwttoken.service';
import {DomainName} from '../../utilities/PathTools';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../services/accountService/account.service';
import {ChangePasswordDTO} from '../../DTOs/account/ChangePasswordDTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SettingsService} from '../../services/settingsService/settings.service';
import {SettingsDTO} from '../../DTOs/settings/SettingsDTO';
import {ImageCropComponent} from '../../primaryPages/sharedComponents/imageCrop/image-crop.component';
import {MatDialog} from '@angular/material/dialog';
import {FirebaseService} from '../../services/firebaseService/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input()
  checked: Boolean;

  activeTab: any;
  showEditButton = false;
  isUploading = false;
  textDirection = TextDirectionController.getTextDirection();
  userProfileImageGuid = null;
  userNickName = null;
  domainName: string = DomainName;
  settingsData: SettingsDTO = {
    isDarkModeOn: false,
    isSeondCalendarOn: false,
    firstCalendar: 1,
    secondCalendar: 0,
    firstWeekDay: 1,
    weekends: [],
    themeColor: '',
    zoomRatio: 0,
  };
  selectedLanguage = 'English';
  languages = ['English', 'فارسی'];
  themeColors = [
    '#FFA12F',
    '#FF5722',
    '#F42C2C',
    '#F83873',
    '#4169E1',
    '#4278DF',
    '#5F81FF',
    '#07A092',
    '#1DB954',
    '#0AB4FF',
    '#08C7E0',
  ];
  calendarTypes = ['gregorian', 'solarHijri'];
  days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  showNewPassword = false;

  requestIsPending = {
    nickName: null,
    firstCalendarType: null,
    toggleSecondCalendar: null,
    secondCalendarType: null,
    firstDayOfWork: null,
    holiday: [],
    changePassword: null,
  };

  notificationPermission = 'default';

  editForm: FormGroup;

  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private directionService: DirectionService,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private dataService: DataService,
    private jwtTokenService: JWTTokenService,
    private accountService: AccountService,
    private _snackBar: MatSnackBar,
    private zoomService: SettingsService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private router: Router,
    private firebaseService: FirebaseService,
  ) {
    if (localStorage.getItem('settingsData') !== null) {
      this.settingsData = SettingsService.getSettingsFromLocalStorage();
    }
    this.userProfileImageGuid = this.jwtTokenService.getUserProfileImageId();
    this.userNickName = this.jwtTokenService.getUserNickName();
    this.selectedLanguage =
      this.localStorageService.get('languageCode') === 'en-US'
        ? 'English'
        : 'فارسی';
  }

  ngOnInit(): void {
    this.activeTab = this.router.url === 'timetrack' ? 'timetrack' : 'profile';
    if (localStorage.getItem('settingsData') === null) {
      this.settingsService.getSettings().subscribe((settings) => {
        this.settingsData = settings;
        SettingsService.updateSettingsInLocalStorage(settings);
      });
    }
    this.zoomService.currentZoom.subscribe((zoom) => {
      if (zoom == null) {
        this.settingsData.zoomRatio = 0.85;
      }
      this.settingsData.zoomRatio = zoom;
    });
    this.dataService.currentSettingsTab.subscribe((tab) => {
      if (tab !== null) {
        this.activeTab = tab;
        this.dataService.changeSettingsTab(null);
      }
    });
    this.editForm = new FormGroup({
      NickName: new FormControl(this.userNickName, [Validators.required]),
      OldPassword: new FormControl(null, [Validators.required]),
      NewPassword: new FormControl(null, [Validators.required]),
    });
    this.notificationPermission = Notification.permission;
  }

  filterHolidays(day) {
    if (this.settingsData.weekends.includes(this.days.indexOf(day) + 1)) {
      this.settingsData.weekends = this.settingsData.weekends.filter(
        (x) => x !== this.days.indexOf(day) + 1
      );
    } else {
      this.settingsData.weekends.push(this.days.indexOf(day) + 1);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction:
        TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
    });
  }

  filterCalendarOptions(selectedType) {
    return this.calendarTypes.filter((x) => x !== selectedType);
  }

  changeLanguage(languageCode: string) {
    this.localStorageService.set('languageCode', languageCode);
    if (localStorage.getItem('userToken') === null) {
    } else {
      this.languageService.changeLanguage(languageCode).subscribe((res) => {
      });
    }
    TextDirectionController.changeDirection();
    this.textDirection = TextDirectionController.getTextDirection();
    this.directionService.changeRotation(
      TextDirectionController.iconRotationDegree
    );
    AppComponent.textDirection = TextDirectionController.textDirection;
    this.dataService.changeDirection(this.textDirection);
  }

  async languageHandler(language) {
    this.dataService.changeLanguage();
    await this.delay(400);
    if (language === 'English') {
      this.translate.use('en');
      this.changeLanguage('en-US');
    } else if (language === 'فارسی') {
      this.translate.use('fa');
      this.changeLanguage('fa-IR');
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  changeThemeColor(color) {
    this.settingsData.themeColor = color.slice(1);
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty(
      '--theme-color-opacity-version',
      this.hexToRgb(color).r +
      ',' +
      this.hexToRgb(color).g +
      ',' +
      this.hexToRgb(color).b
    );
    this.settingsService
      .setThemeColor(this.settingsData.themeColor)
      .subscribe((res) => {
        SettingsService.updateSettingsInLocalStorage(this.settingsData);
      });
  }

  private hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  changeNickName() {
    this.requestIsPending.nickName = true;
    this.accountService
      .updateNickName(this.editForm.controls.NickName.value.toString().trim())
      .subscribe(async (res) => {
        this.requestIsPending.nickName = null;
        this.jwtTokenService.setToken(res.value.token);
        this.userNickName = this.jwtTokenService.getUserNickName();
        localStorage.setItem('userToken', this.jwtTokenService.jwtToken);
        this.editForm.controls.NickName.setValue(
          this.jwtTokenService.getUserNickName()
        );
        this.openSnackBar(
          await this.translate
            .get('Snackbar.changesNicknameSuccessfully')
            .toPromise(),
          await this.translate.get('Buttons.gotIt').toPromise()
        );
      });
  }

  changePassword() {
    this.requestIsPending.changePassword = true;
    this.accountService
      .changePassword(
        new ChangePasswordDTO(
          this.editForm.controls.OldPassword.value,
          this.editForm.controls.NewPassword.value
        )
      )
      .subscribe(
        async (success) => {
          this.requestIsPending.changePassword = null;
          this.editForm.controls.OldPassword.setValue(null);
          this.editForm.controls.NewPassword.setValue(null);
          this.openSnackBar(
            await this.translate
              .get('Snackbar.changesPasswordSuccessfully')
              .toPromise(),
            await this.translate.get('Buttons.gotIt').toPromise()
          );
        },
        async (failed) => {
          if (failed.status === 401) {
            this.openSnackBar(
              await this.translate
                .get('Snackbar.wrongLastPassword')
                .toPromise(),
              await this.translate.get('Buttons.gotIt').toPromise()
            );
          } else if (failed.status === 500) {
            this.openSnackBar(
              await this.translate
                .get('Snackbar.invalidNewPassword')
                .toPromise(),
              await this.translate.get('Buttons.gotIt').toPromise()
            );
          }
        }
      );
  }

  enableNotifications() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.notificationPermission = permission;
        this.firebaseService.receiveMessage();
      }
    });
    if (this.notificationPermission === 'granted') {
      // this.firebaseService.requestPermission();
      // this.firebaseService.receiveMessage();
    }
  }

  setFirstCalendar(calendar) {
    this.requestIsPending.firstCalendarType = calendar;
    const calendarIndex = this.calendarTypes.indexOf(calendar) + 1;
    this.settingsService.setFirstCalendar(calendarIndex).subscribe((res) => {
      this.requestIsPending.firstCalendarType = null;
      this.settingsData.firstCalendar = calendarIndex;
      SettingsService.updateSettingsInLocalStorage(this.settingsData);
    });
  }

  setSecondCalendar(calendar) {
    this.requestIsPending.secondCalendarType = calendar;
    const calendarIndex = this.calendarTypes.indexOf(calendar) + 1;
    this.settingsService.setSecondCalendar(calendarIndex).subscribe((res) => {
      this.requestIsPending.secondCalendarType = null;
      this.settingsData.secondCalendar = calendarIndex;
      SettingsService.updateSettingsInLocalStorage(this.settingsData);
    });
  }

  toggleCalendar() {
    this.requestIsPending.toggleSecondCalendar = true;
    this.settingsData.secondCalendar = null;
    this.settingsService.toggleSecondCalendar().subscribe((res) => {
      this.requestIsPending.toggleSecondCalendar = null;
      this.settingsData.isSeondCalendarOn =
        !this.settingsData.isSeondCalendarOn;
      SettingsService.updateSettingsInLocalStorage(this.settingsData);
    });
  }

  setFirstDayOfTheWeek(day) {
    this.requestIsPending.firstDayOfWork = day;
    const dayIndex = this.days.indexOf(day) + 1;
    this.settingsService.setFirstWeekDay(dayIndex).subscribe((res) => {
      this.requestIsPending.firstDayOfWork = null;
      this.settingsData.firstWeekDay = dayIndex;
      SettingsService.updateSettingsInLocalStorage(this.settingsData);
    });
  }

  setHolidays(day) {
    this.requestIsPending.holiday.push(day);
    this.filterHolidays(day);
    this.settingsService
      .updateWeekends(this.settingsData.weekends)
      .subscribe((res) => {
        this.requestIsPending.holiday.splice(
          this.requestIsPending.holiday.indexOf(day),
          1
        );
        SettingsService.updateSettingsInLocalStorage(this.settingsData);
      });
  }

  setTextSize() {
    this.settingsService
      .setZoomRatio(this.settingsData.zoomRatio)
      .subscribe((res) => {
        SettingsService.updateSettingsInLocalStorage(this.settingsData);
        this.zoomService.changeZoom(this.settingsData.zoomRatio);
      });
  }

  editPhoto() {
    const imageCropperDialog = this.dialog.open(ImageCropComponent, {
      data: {
        imageSource: {
          imageForPreview: '',
          imageForUpload: File,
        },
        croppedImage: '',
      },
    });
    imageCropperDialog.afterClosed().subscribe((result) => {
      this.uploadProfileImage(
        result.imageSource.imageForUpload,
        result.imageSource.imageForPreview
      );
    });
  }

  private uploadProfileImage(imageForUpload, imageForPreview) {
    const endpoint = '/en-US/account/uploadProfileImage';
    const formData = new FormData();
    const headers = new HttpHeaders().append(
      'Content-Disposition',
      'multipart/form-data'
    );
    formData.append('image', imageForUpload, imageForUpload.name);
    this.isUploading = true;
    this.http.put(endpoint, formData, {headers: headers}).subscribe(
      async (res) => {
        this.isUploading = false;
        this.openSnackBar(
          await this.translate
            .get('Snackbar.editedProfilePicSuccessfully')
            .toPromise(),
          await this.translate.get('Buttons.gotIt').toPromise()
        );
        location.reload();
      },
      async (failed) => {
        this.isUploading = false;
        this.openSnackBar(
          await this.translate.get('Snackbar.tryAgain').toPromise(),
          await this.translate.get('Buttons.gotIt').toPromise()
        );
      }
    );
  }
}
