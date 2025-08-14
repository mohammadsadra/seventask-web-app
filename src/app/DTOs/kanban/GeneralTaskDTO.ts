import {UserDTO} from '../user/UserDTO';
import {CheckListDTO} from './CheckListDTO';
import {FileDTO} from '../file/FileDTO';
import {EstimationDTO} from './EstimationDTO';
import {ChecklistItemDTO} from './ChecklistItemDTO';
import {TagDTO} from './TagDTO';

export class GeneralTaskDTO {
  public id: number;
  public guid: string;
  public title: string;
  public createdOn: Date;
  public modifiedOn: Date;
  public description: String;
  public endDate: Date;
  public startDate: Date;
  public createdBy: UserDTO;
  public modifiedBy: UserDTO;
  public priorityId: number;
  public priorityTitle: string;
  public labels: string[];
  public isUrgent: boolean;
  public usersAssignedTo: UserDTO[];
  public tags: TagDTO[];
  public attachments: FileDTO[];
  public pictures: string[];
  public statusId: number;
  public statusTitle: string;
  public teamId: number;
  public projectId: number;
  public projectName: string;
  public teamName: string;
  public boardManualEvenOrder: number;
  public checkListItems: ChecklistItemDTO[];
  public estimations: EstimationDTO[];

  constructor(
    guid: string,
    id: number,
    title: string,
    createdOn: Date,
    modifiedOn: Date,
    description: String,
    endDate: Date,
    isDeleted: boolean,
    startDate: Date,
    createdBy: UserDTO,
    modifiedBy: UserDTO,
    priorityId: number,
    priorityTitle: string,
    isUrgent: boolean,
    usersAssignedTo: UserDTO[],
    statusId: number,
    statusTitle: string,
    teamId: number,
    projectId: number,
    teamName: string,
    projectName: string,
    checkListItems: ChecklistItemDTO[] = [],
    tags: TagDTO[] = [],
    attachments: FileDTO[] = [],
    boardManualEvenOrder: number,
    estimations: EstimationDTO[],
    labels?: string[],
  ) {
    this.guid = guid;
    this.id = id;
    this.title = title;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
    this.description = description;
    this.endDate = endDate;
    this.startDate = startDate;
    this.priorityId = priorityId;
    this.priorityTitle = priorityTitle;
    this.isUrgent = isUrgent;
    this.usersAssignedTo = usersAssignedTo;
    this.statusId = statusId;
    this.statusTitle = statusTitle;
    this.teamId = teamId;
    this.projectId = projectId;
    this.teamName = teamName;
    this.projectName = projectName;
    this.boardManualEvenOrder = boardManualEvenOrder;
    this.checkListItems = checkListItems;
    this.attachments = attachments;
    this.tags = tags;
    this.estimations = estimations;
  }
}
