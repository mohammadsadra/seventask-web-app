import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numToArabic',
  pure: false
})
export class EnglishNumberToArabicNumberPipe implements PipeTransform {

  public transform(n: number): string {
    if (n === null || n === undefined) {
      return '';
    } else if (localStorage.getItem('languageCode') === 'fa-IR') {
      return new Intl.NumberFormat('ar-SA', {useGrouping: false}).format(n);
    } else {
      return Intl.NumberFormat('en-US', {useGrouping: false}).format(n);
    }
  }

}
