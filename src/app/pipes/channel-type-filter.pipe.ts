import {Pipe, PipeTransform} from '@angular/core';
import {channelDTO} from '../DTOs/chat/ChannelDTO';

@Pipe({
  name: 'channelTypeFilter',
  pure: false
})
export class ChannelTypeFilterPipe implements PipeTransform {

  transform(items: channelDTO[], type: number): any {
    if (!items || type == null) {
      return items;
    }
    if (type) {
      return items.filter(item => +item.channelTypeId === type);
    }
  }

}
