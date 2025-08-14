import { Pipe, PipeTransform } from '@angular/core';
import {UserDTO} from '../DTOs/user/UserDTO';

@Pipe({
  name: 'userSearch',
  pure: false
})
export class UserSearchPipe implements PipeTransform {

  transform(items: UserDTO[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    items = items.filter(item => item.nickName.toLowerCase().includes(filter.toLowerCase()));
    return items;
  }

}
