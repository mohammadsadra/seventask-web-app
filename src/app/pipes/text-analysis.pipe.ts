import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textAnalysis',
})
export class TextAnalysisPipe implements PipeTransform {
  transform(value: any, target: string) {
    if (target === 'checklist') {
      return this.checkInput(value);
    } else if (target === 'description') {
      return this.descriptionCheck(value);
    }
  }

  checkInput(title) {
    let tooltiptext = '';
    title.forEach((item) => {
      const charText = item.title.charAt(0);
      const char = new RegExp('[\u0600-\u06FF]');
      const textAlign = char.test(charText) ? 'right' : 'left';
      const tooltipIcon = item.isChecked
        ? 'tooltipChecked'
        : 'tooltipUnchecked';
      tooltiptext +=
        '<div class="d-flex flex-row " dir="auto">' +
        '<div><img style="margin:5px" height="20px" src="assets/icons/Task/' +
        tooltipIcon +
        '.svg"></div>' +
        '<div style="flex-grow: 8; padding-top:5px; text-align: ' +
        textAlign +
        ';">' +
        item.title +
        '</div>' +
        '</div>';
    });
    return tooltiptext;
  }

  /* check discription */
  descriptionCheck(title) {
    const detectBR = title.split('\n');
    let tooltiptext = '';
    detectBR.forEach((item) => {
      const charText = item.charAt(0);
      const char = new RegExp('[\u0600-\u06FF]');
      const textAlign = char.test(charText) ? 'right' : 'left';
      tooltiptext += `<div style="text-align: ${textAlign}; padding:1px 3px;"> ${item} &nbsp;</div>`;
    });
    return tooltiptext;
  }
  /*  */
}
