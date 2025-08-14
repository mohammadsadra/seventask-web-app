import {BaseFilterModel} from './BaseFilterModel';

export class CreatorFilterModel extends BaseFilterModel {
  public query = 'Is'; // is - is not
  public assigneesId: string;

  constructor(
    query: string,
    assigneesId: string,
  ) {
    super('Creator');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'سازنده';
    }
    this.query = query;
    this.assigneesId = assigneesId;
  }
}
