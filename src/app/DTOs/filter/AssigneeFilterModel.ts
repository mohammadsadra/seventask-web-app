import {BaseFilterModel} from './BaseFilterModel';

export class AssigneeFilterModel extends BaseFilterModel {
  public query = 'Is'; // is - is not - set - not set
  public assigneesIds: string[];

  constructor(
    query: string,
    assigneesIds: string[],
  ) {
    super('Assignee');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'مسئول';
    }
    this.query = query;
    this.assigneesIds = assigneesIds;
  }
}
