import {BaseFilterModel} from './BaseFilterModel';

export class TagFilterModel extends BaseFilterModel {
  public is = true;
  public tags: string[];

  constructor(
    tags: string[],
    is: boolean,
  ) {
    super('Tag');
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      this.name = 'تگ';
    }
    this.tags = tags;
    this.is = is;
  }
}
