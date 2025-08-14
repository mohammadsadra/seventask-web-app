import {Pipe, PipeTransform} from '@angular/core';
import {StatusDTO} from '../DTOs/kanban/StatusDTO';

@Pipe({
  name: 'sortStatus',
  pure: false
})
export class SortStatusPipe implements PipeTransform {

  transform(items: StatusDTO[]): any {
    if (!items) {
      return items;
    }
    return items.sort((a, b) => a.evenOrder >= b.evenOrder ? 1 : -1);
  }

}
