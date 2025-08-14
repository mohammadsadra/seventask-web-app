import { Pipe, PipeTransform } from '@angular/core';
import { DomainName } from '../utilities/PathTools';

@Pipe({
  name: 'sliceImageString',
})
export class SliceImageStringPipe implements PipeTransform {
  domainName: string = DomainName;
  transform(str: any, args?: any) {
    for (let i = 0; i < str.length; i++) {
      const pos = str[i].lastIndexOf('ProfileImageGuid');
      if (pos !== -1) {
        const str1 = str[i].slice(pos, str[i].length);
        const str2 = str1.slice(str1.indexOf(':') + 1, str1.length - 1);
        if (str2 === 'null') {
          return './assets/icons/Project/User.svg';
        } else {
          const returnStr = str1.slice(str1.indexOf(':') + 2, str1.length - 2);
          return (
            this.domainName + '/en-US/File/get?id=' + returnStr + '&quality=100'
          );
        }
      }
    }
  }
}
