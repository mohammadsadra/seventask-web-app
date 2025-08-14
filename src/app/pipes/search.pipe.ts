import {Pipe, PipeTransform} from '@angular/core';
import {GeneralTaskDTO} from '../DTOs/kanban/GeneralTaskDTO';
import {CheckListDTO} from '../DTOs/kanban/CheckListDTO';
import {ChecklistItemDTO} from '../DTOs/kanban/ChecklistItemDTO';
import {TagDTO} from '../DTOs/kanban/TagDTO';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(items: GeneralTaskDTO[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item =>
      item.title.toLowerCase().includes(filter.toLowerCase())
      || item.description?.toLowerCase().includes(filter.toLowerCase())
      || item.teamName?.toLowerCase().includes(filter.toLowerCase())
      || item.projectName?.toLowerCase().includes(filter.toLowerCase())
      || this.DoesTasHaveSearchedItem(item.tags, filter)
      || this.DoesChecklistItemsHaveSearchedItem(item.checkListItems, filter)
    );
  }

  private DoesChecklistItemsHaveSearchedItem(checklistItems: ChecklistItemDTO[], searchedItem: string): boolean {
    let result = false;
    if (checklistItems == null) {
      return false;
    }
    checklistItems.forEach(checklistItem => {
          if (checklistItem.title.toLowerCase().includes(searchedItem.toLowerCase())) {
            result = true;
          }
    });
    return result;
  }

  private DoesTasHaveSearchedItem(tags: TagDTO[], searchedItem: string): boolean {
    let result = false;
    if (tags == null || tags.length === 0) {
      return false;
    }
    tags.forEach(tag => {
      if (tag.title.toLowerCase().includes(searchedItem.toLowerCase())) {
        result = true;
      }
    });
    return result;
  }


}
