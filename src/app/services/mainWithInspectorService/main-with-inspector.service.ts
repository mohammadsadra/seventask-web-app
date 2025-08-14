import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {ProjectDTO} from '../../DTOs/project/Project';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {GetRunningTasksResponseModel} from '../../DTOs/responseModel/GetRunningTasksResponseModel';
import {StatusDTO} from '../../DTOs/kanban/StatusDTO';

@Injectable({
  providedIn: 'root'
})
export class MainWithInspectorService {

  private taskSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currenttask = this.taskSource.asObservable();

  private projectSource = new BehaviorSubject<ProjectDTO>(null);
  currentProject = this.projectSource.asObservable();

  private teamSource = new BehaviorSubject<TeamDTO>(null);
  currentTeam = this.teamSource.asObservable();

  private editingTaskSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentEditingTask = this.editingTaskSource.asObservable();

  private editingTaskFromInspectorSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentEditingTaskFromInspector = this.editingTaskFromInspectorSource.asObservable();

  private editingRunningTaskSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentRunningEditingTask = this.editingRunningTaskSource.asObservable();

  private editingRunningTaskIsStoppingSource = new BehaviorSubject<boolean>(false);
  currentRunningTaskIsStoppingSource = this.editingRunningTaskIsStoppingSource.asObservable();

  private addingRunningTaskSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentAddingRunningTask = this.addingRunningTaskSource.asObservable();

  private allStatusesSource = new BehaviorSubject<StatusDTO[]>([]);
  currentAllStatuses = this.allStatusesSource.asObservable();

  constructor() {
  }

  changeMessage(message: GeneralTaskDTO) {
    this.taskSource.next(message);
  }

  changeSelectedProject(project: ProjectDTO) {
    this.projectSource.next(project);
  }

  changeSelectedTeam(team: TeamDTO) {
    this.teamSource.next(team);
  }

  changeEditingTask(task: GeneralTaskDTO) {
    this.editingTaskSource.next(task);
  }

  changeEditingTaskFromInspector(task: GeneralTaskDTO) {
    this.editingTaskFromInspectorSource.next(task);
  }

  changeRunningEditingTask(task: GeneralTaskDTO) {
    this.editingRunningTaskSource.next(task);
  }

  changeEditingRunningTaskIsStopping(b: boolean) {
    this.editingRunningTaskIsStoppingSource.next(b);
  }

  changeAddingRunningTask(t: GeneralTaskDTO) {
    this.addingRunningTaskSource.next(t);
  }

  changeAllStatuses(statuses: StatusDTO[]) {
    this.allStatusesSource.next(statuses);
  }
}
