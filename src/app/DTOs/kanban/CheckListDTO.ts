import {ChecklistItemDTO} from './ChecklistItemDTO';

export class CheckListDTO {
  public id: number;
  public title: string;
  public items: ChecklistItemDTO[];

  constructor(title: string, items: ChecklistItemDTO[] = []) {
    this.title = title;
    this.items = items;
  }
}
