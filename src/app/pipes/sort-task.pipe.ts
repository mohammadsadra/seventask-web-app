import {Pipe, PipeTransform} from '@angular/core';
import {GeneralTaskDTO} from '../DTOs/kanban/GeneralTaskDTO';

@Pipe({
  name: 'sortTask',
  pure: false
})
export class SortTaskPipe implements PipeTransform {

  transform(items: GeneralTaskDTO[], sortName: string, ascending: boolean = true): any {
    if (!items) {
      return items;
    }

    if (sortName == null) {
      return items.sort((a, b) => a.createdOn <= b.createdOn ? 1 : -1);
    }

    if (sortName === 'priority') {
      if (ascending) {
        return items.sort((a, b) =>
          a.priorityId === b.priorityId ? (a.createdOn > b.createdOn ? 1 : -1) : (a.priorityId >= b.priorityId ? 1 : -1));
      } else {
        return items.sort((a, b) =>
          a.priorityId === b.priorityId ? (a.createdOn > b.createdOn ? 1 : -1) : (a.priorityId <= b.priorityId ? 1 : -1));
      }
    }

    if (sortName === 'creationDate') {
      if (ascending) {
        return items.sort((a, b) => a.createdOn >= b.createdOn ? 1 : -1);
      } else {
        return items.sort((a, b) => a.createdOn <= b.createdOn ? 1 : -1);
      }
    }

    if (sortName === 'lastModifiedOn') {
      if (ascending) {
        return items.sort((a, b) => a.modifiedOn <= b.modifiedOn ? 1 : -1);
      } else {
        return items.sort((a, b) => a.modifiedOn >= b.modifiedOn ? 1 : -1);
      }
    }

    if (sortName === 'estimatedTime') {
      if (ascending) {
        return items.sort((a, b) =>
          Math.max.apply(Math, a.estimations.map(function (o) {
            return o.estimationTimeInMinute;
          }))
          >= Math.max.apply(Math, b.estimations.map(function (o) {
            return o.estimationTimeInMinute;
          })) ? 1 : -1);
      } else {
        return items.sort((a, b) =>
          Math.max.apply(Math, a.estimations.map(function (o) {
            return o.estimationTimeInMinute;
          }))
          <= Math.max.apply(Math, b.estimations.map(function (o) {
            return o.estimationTimeInMinute;
          })) ? 1 : -1);
      }
    }

    if (sortName === 'manual') {
      // if (ascending) {
      //   return items.sort((a, b) => a.boardManualEvenOrder > b.boardManualEvenOrder ? 1 : -1);
      // } else {
      //   return items.sort((a, b) => a.boardManualEvenOrder < b.boardManualEvenOrder ? 1 : -1);
      // }
      // if (ascending) {
      return items.sort((a, b) =>
        a.boardManualEvenOrder === b.boardManualEvenOrder
          ? (a.createdOn > b.createdOn ? 1 : -1)
          : (a.boardManualEvenOrder < b.boardManualEvenOrder ? 1 : -1));
      // }
      // else {
      //   return items.sort((a, b) =>
      //     a.boardManualEvenOrder === b.boardManualEvenOrder
      //       ? (a.createdOn > b.createdOn ? 1 : -1)
      //       : (a.boardManualEvenOrder < b.boardManualEvenOrder ? 1 : -1));
      // }
    }

    // return null;
  }

}
