import {Pipe, PipeTransform} from '@angular/core';
import {channelDTO} from '../DTOs/chat/ChannelDTO';

@Pipe({
  name: 'channelSearch',
  pure: false
})
export class ChannelSearchPipe implements PipeTransform {

  transform(items: channelDTO[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    items = items.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));
    return items;
  }

}
