import {ProjectDTO} from '../project/Project';
import {TeamDTO} from '../team/Team.DTO';

export class KanbanSettingsDTO {
  public selectedProject: ProjectDTO;
  public selectedTeam: TeamDTO;
  public isPersonalSelected: boolean;
  public isPersonalProjectsSelected: boolean;
  public isAllTasksSelected: boolean;


  constructor(
    selectedProject: ProjectDTO,
    selectedTeam: TeamDTO,
    isPersonalSelected: boolean,
    isPersonalProjectsSelected: boolean,
    isAllTasksSelected: boolean,
  ) {
    this.selectedProject = selectedProject;
    this.selectedTeam = selectedTeam;
    this.isPersonalSelected = isPersonalSelected;
    this.isPersonalProjectsSelected = isPersonalProjectsSelected;
    this.isAllTasksSelected = isAllTasksSelected;
  }
}
