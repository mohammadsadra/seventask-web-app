import {Pipe, PipeTransform} from '@angular/core';
import {TeamDTO} from '../DTOs/team/Team.DTO';
import {ProjectDTO} from '../DTOs/project/Project';

@Pipe({
  name: 'projectSearch',
  pure: false
})
export class ProjectSearchPipe implements PipeTransform {

  transform(items: ProjectDTO[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    items = items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
    return items;
  }

}
