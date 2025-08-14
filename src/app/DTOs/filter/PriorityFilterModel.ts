import {BaseFilterModel} from './BaseFilterModel';

export class PriorityFilterModel extends BaseFilterModel {
  public is = true;
  public priorityIds: number[]; // priorityIds

  constructor(
    is: boolean,
    priorityIds: number[],
  ) {
    super('Priority');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'اولویت';
    }
    this.is = is;
    this.priorityIds = priorityIds;
  }
}
