export class SortSettings {
  sortName: string;
  isAscending: boolean;

  constructor(
    sortName: string,
    isAscending: boolean,
  ) {
    this.sortName = sortName;
    this.isAscending = isAscending;
  }
}
