import {Pipe, PipeTransform} from '@angular/core';
import {GeneralTaskDTO} from '../DTOs/kanban/GeneralTaskDTO';
import {BaseFilterModel} from '../DTOs/filter/BaseFilterModel';
import {PriorityFilterModel} from '../DTOs/filter/PriorityFilterModel';
import {AssigneeFilterModel} from '../DTOs/filter/AssigneeFilterModel';
import {UrgentFilterModel} from '../DTOs/filter/UrgentFilterModel';
import {StatusFilterModel} from '../DTOs/filter/StatusFilterModel';
import {CreatorFilterModel} from '../DTOs/filter/CreatorFilterModel';
import {TagFilterModel} from '../DTOs/filter/TagFilterModel';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {

  transform(items: GeneralTaskDTO[], filters: BaseFilterModel[], andOr: boolean): any {

    if (!items || !filters || filters.length === 0) {
      return items;
    }
    // console.log(andOr);
    if (andOr) {
      let result = items;
      filters.forEach(filterObject => {
          if (filterObject.name === 'Priority' || filterObject.name === 'اولویت') {
            const priorityFilterObject = <PriorityFilterModel>filterObject;
            if (priorityFilterObject.priorityIds.length === 0) {
              return items;
            }
            if (!priorityFilterObject.is) {
              result = result.filter(item => !priorityFilterObject.priorityIds.includes(item.priorityId));
            } else {
              // console.log(filterObject);
              result = result.filter(item => priorityFilterObject.priorityIds.some(f => f === item.priorityId));

            }
          } else if (filterObject.name === 'Assignee' || filterObject.name === 'مسئول') {
            const assigneeFilterObject = <AssigneeFilterModel>filterObject;
            if (assigneeFilterObject.assigneesIds.length === 0 && assigneeFilterObject.query !== 'Set' && assigneeFilterObject.query !== 'Is Not Set') {
              return items;
            } else if (assigneeFilterObject.query === 'Set') {
              result = result.filter(item => item.usersAssignedTo.length >= 1);
            } else if (assigneeFilterObject.query === 'Is Not Set') {
              result = result.filter(item => item.usersAssignedTo.length === 0);
            } else if (assigneeFilterObject.query === 'Is') {
              result = result.filter(item => this.hasSelectedAssignees(item, assigneeFilterObject.assigneesIds));
            } else if (assigneeFilterObject.query === 'Is Not') {
              result = result.filter(item => this.doesNotHaveSelectedAssignees(item, assigneeFilterObject.assigneesIds));
            }
          } else if (filterObject.name === 'Creator' || filterObject.name === 'سازنده') {
            const creatorFilterObject = <CreatorFilterModel>filterObject;
            if (creatorFilterObject.assigneesId == null) {
              return items;
            } else if (creatorFilterObject.query === 'Is') {
              result = result.filter(item => item.createdBy.userId === creatorFilterObject.assigneesId);
            } else if (creatorFilterObject.query === 'Is Not') {
              result = result.filter(item => item.createdBy.userId !== creatorFilterObject.assigneesId);
            }
          } else if (filterObject.name === 'Urgent' || filterObject.name === 'اورژانسی') {
            const urgentFilterObject = <UrgentFilterModel>filterObject;
            if (urgentFilterObject.is) {
              result = result.filter(item => item.isUrgent);
            } else {
              result = result.filter(item => !item.isUrgent);
            }
          } else if (filterObject.name === 'Status' || filterObject.name === 'وضعیت') {
            const statusFilterObject = <StatusFilterModel>filterObject;
            if (statusFilterObject.statusNames.length === 0) {
              return items;
            }
            if (!statusFilterObject.is) {
              result = result.filter(item => !statusFilterObject.statusNames.includes(item.statusTitle));
            } else {
              // console.log(filterObject);
              result = result.filter(item => statusFilterObject.statusNames.some(f => f === item.statusTitle));

            }
          } else if (filterObject.name === 'Tag' || filterObject.name === 'تگ') {
            const tagFilterObject = <TagFilterModel>filterObject;
            if (tagFilterObject.tags.length === 0) {
              return items;
            }
            if (!tagFilterObject.is) {
              result = result.filter(item => this.doesNotHaveAllSelectedTags(item, tagFilterObject.tags));
            } else {
              result = result.filter(item => this.hasAllSelectedTags(item, tagFilterObject.tags));

            }
          }
        }
      );
      return result;
    } else {
      let result = items;
      filters.forEach((filterObject, i: number) => {
        if (filterObject.name === 'Priority' || filterObject.name === 'اولویت') {
          const priorityFilterObject = <PriorityFilterModel>filterObject;
          if (priorityFilterObject.priorityIds.length === 0) {
            return items;
          }
          if (!priorityFilterObject.is) {
            if (i === 0) {
              result = items.filter(item => !priorityFilterObject.priorityIds.includes(item.priorityId));
            } else {
              items.filter(item => !priorityFilterObject.priorityIds.includes(item.priorityId))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          } else {
            if (i === 0) {
              result = items.filter(item => priorityFilterObject.priorityIds.some(f => f === item.priorityId));
            } else {
              items.filter(item => priorityFilterObject.priorityIds.some(f => f === item.priorityId))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          }
        } else if (filterObject.name === 'Assignee' || filterObject.name === 'مسئول') {
          const assigneeFilterObject = <AssigneeFilterModel>filterObject;
          if (assigneeFilterObject.assigneesIds.length === 0 && assigneeFilterObject.query !== 'Set' && assigneeFilterObject.query !== 'Is Not Set') {
            return items;
          } else if (assigneeFilterObject.query === 'Set') {
            if (i === 0) {
              result = items.filter(item => item.usersAssignedTo.length >= 1);
            } else {
              items.filter(item => item.usersAssignedTo.length >= 1).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          } else if (assigneeFilterObject.query === 'Is Not Set') {
            if (i === 0) {
              result = items.filter(item => item.usersAssignedTo.length === 0);
            } else {
              items.filter(item => item.usersAssignedTo.length === 0).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          } else if (assigneeFilterObject.query === 'Is') {
            if (i === 0) {
              result = items.filter(item => this.hasSelectedAssignees(item, assigneeFilterObject.assigneesIds));
            } else {
              items.filter(item => this.hasSelectedAssignees(item, assigneeFilterObject.assigneesIds)).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          } else if (assigneeFilterObject.query === 'Is Not') {
            if (i === 0) {
              result = items.filter(item => this.doesNotHaveSelectedAssignees(item, assigneeFilterObject.assigneesIds));
            } else {
              items.filter(item => this.doesNotHaveSelectedAssignees(item, assigneeFilterObject.assigneesIds)).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          }
        } else if (filterObject.name === 'Creator' || filterObject.name === 'سازنده') {
          const creatorFilterObject = <CreatorFilterModel>filterObject;
          if (creatorFilterObject.assigneesId == null) {
            return items;
          } else if (creatorFilterObject.query === 'Is') {
            result = items.filter(item => item.createdBy.userId === creatorFilterObject.assigneesId);
          } else if (creatorFilterObject.query === 'Is Not') {
            result = items.filter(item => item.createdBy.userId !== creatorFilterObject.assigneesId);
          }
        } else if (filterObject.name === 'Urgent' || filterObject.name === 'اورژانسی') {
          const urgentFilterObject = <UrgentFilterModel>filterObject;
          if (urgentFilterObject.is) {
            if (i === 0) {
              result = items.filter(item => item.isUrgent);
            } else {
              items.filter(item => item.isUrgent).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          } else {
            if (i === 0) {
              result = items.filter(item => !item.isUrgent);
            } else {
              items.filter(item => !item.isUrgent).forEach(t => {
                if (!result.includes(t)) {
                  result.push(t);
                }
              });
            }
          }
        } else if (filterObject.name === 'Status' || filterObject.name === 'وضعیت') {
          const statusFilterObject = <StatusFilterModel>filterObject;
          if (statusFilterObject.statusNames.length === 0) {
            return items;
          }
          if (!statusFilterObject.is) {
            if (i === 0) {
              result = items.filter(item => !statusFilterObject.statusNames.includes(item.statusTitle));
            } else {
              items.filter(item => !statusFilterObject.statusNames.includes(item.statusTitle))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          } else {
            if (i === 0) {
              result = items.filter(item => statusFilterObject.statusNames.some(f => f === item.statusTitle));
            } else {
              items.filter(item => statusFilterObject.statusNames.some(f => f === item.statusTitle))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          }
        } else if (filterObject.name === 'Tag' || filterObject.name === 'تگ') {
          const tagFilterObject = <TagFilterModel>filterObject;
          if (tagFilterObject.tags.length === 0) {
            return items;
          }
          if (!tagFilterObject.is) {
            if (i === 0) {
              result = items.filter(item => this.doesNotHaveAllSelectedTags(item, tagFilterObject.tags));
            } else {
              items.filter(item => this.doesNotHaveAllSelectedTags(item, tagFilterObject.tags))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          } else {
            if (i === 0) {
              result = items.filter(item => this.hasAllSelectedTags(item, tagFilterObject.tags));
            } else {
              items.filter(item => this.hasAllSelectedTags(item, tagFilterObject.tags))
                .forEach(t => {
                  if (!result.includes(t)) {
                    result.push(t);
                  }
                });
            }
          }
        }
      });
      return result;
    }
  }


  private hasSelectedAssignees(task: GeneralTaskDTO, selectedAssignees: string[]): boolean {

    let temp = false;
    selectedAssignees.forEach(assignee => {
      if (task.usersAssignedTo.some(u => u.userId === assignee)) {
        temp = true;
        return temp;
      }
    });
    return temp;
  }

  private doesNotHaveSelectedAssignees(task: GeneralTaskDTO, selectedAssignees: string[]): boolean {

    let temp = false;
    selectedAssignees.forEach(assignee => {
      if (!task.usersAssignedTo.find(u => assignee === u.userId)) {
        temp = true;
        return true;
      }
    });
    return temp;
  }

  private hasAllSelectedTags(task: GeneralTaskDTO, selectedTags: string[]): boolean {
    let temp = true;
    selectedTags.forEach(tag => {
      if (!task.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())) {
        temp = false;
      }
    });
    return temp;
  }

  private doesNotHaveAllSelectedTags(task: GeneralTaskDTO, selectedTags: string[]): boolean {
    let temp = true;
    selectedTags.forEach(tag => {
      if (task.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())) {
        temp = false;
      }
    });
    return temp;
  }


}
