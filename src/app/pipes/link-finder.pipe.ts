import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'linkFinder'
})
export class LinkFinderPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(text: string, color: string): any {
    let hasHttp = true;
    const http = 'https://';
    let match = text.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    if (match === null) {
      hasHttp = false;
      match = text.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    }
    if (match == null) {
      return text;
    }
    let final = text;
    match.map(url => {
      // tslint:disable-next-line:max-line-length
      final = hasHttp ? final.replace(url, '<a style="color:' + color + '!important; text-decoration: underline;"   href="' + url + '" target="_BLANK">' + url + '</a>') :
        final.replace(url, '<a style="color:' + color + '!important; text-decoration: underline;" href="https://' + url + '" target="_BLANK">' + url + '</a>');
    });
    return this.sanitizer.bypassSecurityTrustHtml(final);
    console.log(final);
    console.log('_________________________________________________');
  }

}
