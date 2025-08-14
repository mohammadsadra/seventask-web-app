import {LocalStorageService} from '../services/localStorageService/local-storage.service';
import {DirectionService} from '../services/directionService/direction.service';
import {OnInit} from '@angular/core';
import {DataService} from '../services/dataService/data.service';

export class TextDirectionController {

  constructor(private dataService: DataService) {
    // this.changeDirection();
  }

  public static textDirection = localStorage.getItem('languageCode') === 'en-US' ? 'ltr' : 'rtl';
  public static iconRotationDegree = 0;

  public static getTextDirection() {
    return this.textDirection;
  }

  public static getIconRotationDegree() {
    return this.iconRotationDegree;
  }

  public static changeDirection(): void {
    const lang = localStorage.getItem('languageCode');
    if (lang === 'fa-IR') {
      this.textDirection = 'rtl';
      this.iconRotationDegree = 180;
      let d = new DirectionService();
      d.changeRotation(180);
    } else if (lang === 'en-US') {
      this.textDirection = 'ltr';
      this.iconRotationDegree = 0;
      let d = new DirectionService();
      d.changeRotation(0);
    }
  }
}
