import { Component, OnInit, Renderer2 } from '@angular/core';
import { LanguageService } from './services/languageService/language.service';
import { TranslateService } from '@ngx-translate/core';
import { TextDirectionController } from './utilities/TextDirectionController';
import { DirectionService } from './services/directionService/direction.service';
import { SettingsService } from './services/settingsService/settings.service';
import {fadeInOutAnimation, slideInAnimation} from '../animations/animations';
import {RouterOutlet} from '@angular/router';
import { DataService } from './services/dataService/data.service';
import {FirebaseService} from './services/firebaseService/firebase.service';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ slideInAnimation, fadeInOutAnimation ]
})
export class AppComponent implements OnInit {
  public static textDirection = TextDirectionController.textDirection;
  // zoomRatio = SettingsService.getSettingsFromLocalStorage().zoomRatio;
  // zoomRatio = 0.5;
  language: any = 'en-US';
  currentVersion: any;
  changedLanguage: boolean = false;

  title = 'push-notification';
  message;

  getTextDirection() {
    return AppComponent.textDirection;
  }

  constructor(
    private firebaseService: FirebaseService,
    private languageService: LanguageService,
    private renderer: Renderer2,
    private directionService: DirectionService,
    public translate: TranslateService,
    public dataService: DataService
  ) {
    translate.addLangs(['en', 'fa']);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/fa|en/) ? browserLang : 'fa');
    amplitude.init('ac4ecbdd89d3512c31cd494f387271b6', undefined, {serverUrl: 'https://ext.seventask.com/2/httpapi'});
  }

  // ngOnInit() {
  //   if (localStorage.getItem('languageCode') === null) {
  //     this.languageService.getLanguage().subscribe(res => {
  //       this.language = res.cultureAbbriviation;
  //       localStorage.setItem('languageCode', res.cultureAbbriviation);
  //       console.log(window.location.href.split('/')[3]);
  //       if (window.location.href.split('/')[3] !== res.cultureAbbriviation) {
  //         window.location.replace('/' + res.cultureAbbriviation + window.location.href.split(window.location.href.split('/')[3])[1]);
  //         console.log(window.location.href);
  //       }
  //     }, error => {
  //       localStorage.setItem('languageCode', 'en-US');
  //       this.language = localStorage.getItem('languageCode');
  //     });
  //   } else {
  //     this.language = localStorage.getItem('languageCode');
  //     console.log(window.location.href.split('/'));
  //     if (window.location.href.split('/')[3] !== localStorage.getItem('languageCode')) {
  //       console.log(window.location.href.split('/')[3]);
  //       console.log(window.location.href.split(window.location.href.split('/')[3])[1]);
  //       // tslint:Disable-next-line:max-line-length
  //       window.location.replace('/' + localStorage.getItem('languageCode') + window.location.href.split(window.location.href.split('/')[3])[1]);
  //       console.log(window.location.href)
  //     }
  //   }
  // }

  ngOnInit() {
    // this.firebaseService.requestPermission();
    // this.firebaseService.receiveMessage();
    this.message = this.firebaseService.currentMessage;

    this.dataService.changeLanguageObservable.subscribe((bool) => {
      if (bool) {
       this.changedLanguage = true;
       setTimeout(() => {
         this.changedLanguage = false;
       }, 400);
      }
    });
    let themeColor = '#4278DF';
    if (localStorage.getItem('settingsData') !== null) {
      if (
        SettingsService.getSettingsFromLocalStorage().themeColor !==
          undefined &&
        SettingsService.getSettingsFromLocalStorage().themeColor !== ''
      ) {
        themeColor =
          '#' + SettingsService.getSettingsFromLocalStorage().themeColor;
      }
    }
    document.documentElement.style.setProperty('--theme-color', themeColor);
    document.documentElement.style.setProperty(
      '--theme-color-opacity-version',
      this.hexToRgb(themeColor).r +
        ',' +
        this.hexToRgb(themeColor).g +
        ',' +
        this.hexToRgb(themeColor).b
    );
    if (localStorage.getItem('languageCode') === null) {
      this.languageService.getLanguage().subscribe(
        (res) => {
          this.language = res.cultureAbbriviation;
          localStorage.setItem('languageCode', res.cultureAbbriviation);
          if (this.language === 'en-US') {
            this.translate.use('en');
          } else if (this.language === 'fa-IR') {
            this.translate.use('fa');
          }
          TextDirectionController.changeDirection();
          this.directionService.changeRotation(
            TextDirectionController.iconRotationDegree
          );
          AppComponent.textDirection = TextDirectionController.textDirection;
        },
        (error) => {
          localStorage.setItem('languageCode', 'en-US');
          this.language = localStorage.getItem('languageCode');
          this.translate.use('en');
          TextDirectionController.changeDirection();
          this.directionService.changeRotation(
            TextDirectionController.iconRotationDegree
          );
          AppComponent.textDirection = TextDirectionController.textDirection;
        }
      );
    } else {
      this.language = localStorage.getItem('languageCode');
      if (this.language === 'en-US') {
        this.translate.use('en');
      } else if (this.language === 'fa-IR') {
        this.translate.use('fa');
      }
      this.languageService.getLanguage().subscribe((res) => {
        if (res.cultureAbbriviation !== localStorage.getItem('languageCode')) {
          this.languageService
            .changeLanguage(localStorage.getItem('languageCode'))
            .subscribe();
        }
      });
      TextDirectionController.changeDirection();
      this.directionService.changeRotation(
        TextDirectionController.iconRotationDegree
      );
      AppComponent.textDirection = TextDirectionController.textDirection;
    }

    // this.refreshToken();
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  // refreshToken() {
  //   const expiryTime: number = this.jwtTokenService.getExpiryTime();
  //   if (expiryTime) {
  //     console.log('start timer');
  //     setTimeout(() => {
  //       const tokensDTO: TokensDTO = new TokensDTO(localStorage.getItem('userToken'), localStorage.getItem('refreshToken'));
  //       this.accountService.refreshToken(tokensDTO).subscribe(res => {
  //         localStorage.setItem('userToken', res.value.token);
  //         localStorage.setItem('refreshToken', res.value.refreshToken);
  //         console.log('renew :app.cpm');
  //         setTimeout(() => {
  //           this.refreshToken();
  //         }, 10000);
  //       }, err => {
  //         console.log('fail renew');
  //         localStorage.removeItem('userToken');
  //         localStorage.removeItem('refreshToken');
  //         this.router.navigate(['/signIn']);
  //       });
  //     }, this.jwtTokenService.getExpiryTimeLen());
  //   }
  // }
}
