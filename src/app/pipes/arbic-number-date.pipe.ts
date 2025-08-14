import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getArabicNum',
})
export class ArbicNumberDatePipe implements PipeTransform {
  transform(s: string): unknown {
    return new Intl.NumberFormat('ar-SA', { useGrouping: false }).format(
      Number(s)
    );
  }
}
