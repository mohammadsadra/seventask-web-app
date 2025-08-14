import {CheckListDTO} from './CheckListDTO';
import {TagDTO} from './TagDTO';
import {ChecklistItemDTO} from './ChecklistItemDTO';
import {ChecklistItemPostDTO} from './ChecklistItemPostDTO';

export class GeneralTaskPostDTO {

  public title: string;
  public description: String;
  public endDate: Date;
  public startDate: Date;
  public priorityId: number;
  public teamId?: number;
  public projectId?: number;
  public users: string[];
  public statusId?: number;
  public checkListItems: ChecklistItemPostDTO[];
  public tags: TagDTO[];
  public attachments: string[];


  constructor(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    priorityId: number = 1,
    teamId: number = null,
    projectId: number = null,
    users: string[] = [],
    statusId: number = null,
    checkListItems: ChecklistItemPostDTO[] = [],
    attachments: string[] = [],
    tags: TagDTO[] = []
  ) {
    this.title = title;
    this.description = description;
    this.endDate = endDate;
    this.startDate = startDate;
    this.priorityId = priorityId;
    this.teamId = teamId;
    this.projectId = projectId;
    this.users = users;
    this.statusId = statusId;
    this.checkListItems = checkListItems;
    this.attachments = attachments;
    this.tags = tags;

  }
}
