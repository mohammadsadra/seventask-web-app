import {BaseFilterModel} from './BaseFilterModel';

export class StatusFilterModel extends BaseFilterModel {
  public is = true;
  public statusNames: string[]; // StatusNames

  constructor(
    is: boolean,
    statusNames: string[],
  ) {
    super('Status');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'وضعیت';
    }
    this.is = is;
    this.statusNames = statusNames;
  }
}
