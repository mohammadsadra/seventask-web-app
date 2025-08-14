import {BaseFilterModel} from './BaseFilterModel';

export class UrgentFilterModel extends BaseFilterModel {
  public is = false;
  // public priorityIds: number[]; // priorityIds

  constructor(
    is: boolean,
  ) {
    super('Urgent');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'اورژانسی';
    }
    this.is = is;
  }
}
