import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ProjectDTO} from '../../DTOs/project/Project';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {BaseFilterModel} from '../../DTOs/filter/BaseFilterModel';
import {DepartmentDTO} from '../../DTOs/department/DepartmentDTO';
import {UserDTO} from '../../DTOs/user/UserDTO';
import {TaskCommentDTO} from '../../DTOs/kanban/TaskCommentDTO';
import {HubCommentResponseModel} from '../../DTOs/hub/HubCommentResponseModel';
import {HubEditTaskResponseModel} from '../../DTOs/hub/HubEditTaskResponseModel';
import {ChecklistItemDTO} from '../../DTOs/kanban/ChecklistItemDTO';
import {FileDTO} from '../../DTOs/file/FileDTO';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private refreshingToken = new BehaviorSubject(false);
  refreshingTokenObserable = this.refreshingToken.asObservable();

  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();

  private projectSource = new BehaviorSubject<ProjectDTO>(null);
  currentProject = this.projectSource.asObservable();

  private projectNumberSource = new BehaviorSubject<number>(null);
  currentProjectNumber = this.projectNumberSource.asObservable();

  private teamTaskNumberSource = new BehaviorSubject<number>(null);
  currentTeamTaskNumber = this.teamTaskNumberSource.asObservable();

  private projectTypeSource = new BehaviorSubject<string>('all');
  currentProjectType = this.projectTypeSource.asObservable();

  private taskNumberSource = new BehaviorSubject<number>(null);
  currentTaskNumber = this.taskNumberSource.asObservable();

  private teamSource = new BehaviorSubject<TeamDTO>(null);
  currentTeam = this.teamSource.asObservable();

  private newDepartmentSource = new BehaviorSubject<DepartmentDTO>(null);
  currentDepartment = this.newDepartmentSource.asObservable();

  private newDepartmentMembersSource = new BehaviorSubject<any>(null);
  currentNewDepartmentMembers = this.newDepartmentMembersSource.asObservable();

  private projectTasksSource = new BehaviorSubject<ProjectDTO>(null);
  currentProjectTasks = this.projectTasksSource.asObservable();

  private teamTasksSource = new BehaviorSubject<TeamDTO>(null);
  currentTeamTasks = this.teamTasksSource.asObservable();

  private isPersonalSelectedSource = new BehaviorSubject<boolean>(false);
  currentIsPersonalSelected = this.isPersonalSelectedSource.asObservable();

  private isPersonalProjectsSelectedSource = new BehaviorSubject<boolean>(
    false
  );
  currentIsPersonalProjectSelected =
    this.isPersonalProjectsSelectedSource.asObservable();

  private isAllTasksSelectedSource = new BehaviorSubject<boolean>(false);
  currentIsAllTasksSelected = this.isAllTasksSelectedSource.asObservable();

  private addingTaskSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentAddingTask = this.addingTaskSource.asObservable();

  private searchedTaskSource = new BehaviorSubject<string>('');
  currentSearchedTask = this.searchedTaskSource.asObservable();

  private enabledFiltersSource = new BehaviorSubject<BaseFilterModel[]>(null);
  currentEnabledFilters = this.enabledFiltersSource.asObservable();

  private andOrSource = new BehaviorSubject<boolean>(true);
  currentAndOr = this.andOrSource.asObservable();

  private receiveNotificationSource = new BehaviorSubject<any>(null);
  currentReceiveNotification = this.receiveNotificationSource.asObservable();

  private receiveStopTimeSource = new BehaviorSubject<any>(null);
  currentStopTime = this.receiveStopTimeSource.asObservable();

  private receiveStartTimeSource = new BehaviorSubject<any>(null);
  currentStartTime = this.receiveStartTimeSource.asObservable();

  private receivePausedTimeSource = new BehaviorSubject<any>(null);
  currentPausedTime = this.receivePausedTimeSource.asObservable();

  private receiveSettingsTabSource = new BehaviorSubject<string>(null);
  currentSettingsTab = this.receiveSettingsTabSource.asObservable();

  private receiveDirection = new BehaviorSubject<string>(null);
  currentDirection = this.receiveDirection.asObservable();

  private sortNameSource = new BehaviorSubject<string>(null);
  currentSortName = this.sortNameSource.asObservable();

  private isAscendingSource = new BehaviorSubject<boolean>(null);
  currentIsAscending = this.isAscendingSource.asObservable();

  private updateProfilePicBehavior = new BehaviorSubject<Date>(null);
  updateProfilePicObservable = this.updateProfilePicBehavior.asObservable();

  private changeLanguageBehavior = new BehaviorSubject<boolean>(null);
  changeLanguageObservable = this.changeLanguageBehavior.asObservable();

  private getTaskApisFinishedSource = new BehaviorSubject<boolean>(false);
  currentGetTaskApisFinished = this.getTaskApisFinishedSource.asObservable();

  private taskCommentSource = new BehaviorSubject<HubCommentResponseModel>(
    null
  );
  currentTaskComment = this.taskCommentSource.asObservable();

  // HUB dataService ************************************************************************************
  private taskCreatedSource = new BehaviorSubject<GeneralTaskDTO>(null);
  currentTaskCreated = this.taskCreatedSource.asObservable();

  private taskUpdatedSource = new BehaviorSubject<HubEditTaskResponseModel>(null);
  currentTaskUpdated = this.taskUpdatedSource.asObservable();

  private taskDeletedSource = new BehaviorSubject<number>(null);
  currentTaskDeleted = this.taskDeletedSource.asObservable();

  private checkListItemCreatedSource = new BehaviorSubject<ChecklistItemDTO>(null);
  currentCheckListItemCreated = this.checkListItemCreatedSource.asObservable();

  private checkListItemUpdatedSource = new BehaviorSubject<ChecklistItemDTO>(null);
  currentCheckListItemUpdated = this.checkListItemUpdatedSource.asObservable();

  private checkListItemDeletedSource = new BehaviorSubject<any>(null);
  currentCheckListItemDeleted = this.checkListItemDeletedSource.asObservable();

  private taskAssigneesAddedSource = new BehaviorSubject<{ id: number, failedAssigns: UserDTO[], successAssigns: UserDTO[] }>(null);
  currentTaskAssigneesAdded = this.taskAssigneesAddedSource.asObservable();

  private taskAttachmentAddedSource = new BehaviorSubject<{ taskId: number, attachments: FileDTO[] }>(null);
  currentTaskAttachmentAdded = this.taskAttachmentAddedSource.asObservable();

  private taskAttachmentDeletedSource = new BehaviorSubject<{ taskId: number, fileContainerId: number, fileContainerGuid: string }>(null);
  currentTaskAttachmentDeleted = this.taskAttachmentDeletedSource.asObservable();

  private taskEstimationAddedSource = new BehaviorSubject<{ taskId: number, estimationInMinutes: number, user: UserDTO }>(null);
  currentTaskEstimationAdded = this.taskEstimationAddedSource.asObservable();

  private taskEstimationUpdatedSource = new BehaviorSubject<{ taskId: number, estimationInMinutes: number, userId: string }>(null);
  currentTaskEstimationUpdated = this.taskEstimationUpdatedSource.asObservable();

  private taskEstimationDeletedSource = new BehaviorSubject<{ taskId: number, estimationInMinutes: number, userId: string }>(null);
  currentTaskEstimationDeleted = this.taskEstimationDeletedSource.asObservable();

  private taskStatusUpdatedSource = new BehaviorSubject<{ id: number, taskStatusId: number, order: number }>(null);
  currentTaskStatusUpdated = this.taskStatusUpdatedSource.asObservable();

  // **************************************************************************


  // **************************************************************************
  private tagFromInspectorSource = new BehaviorSubject<string>(null);
  currentTagFromInspector = this.tagFromInspectorSource.asObservable();
  // **************************************************************************

  private taskToLeftNavBarBehavior = new Subject<GeneralTaskDTO[]>();
  getTasks = this.taskToLeftNavBarBehavior.asObservable();

  private updateTimelinesOffset = new Subject<any>();
  getOffsets = this.updateTimelinesOffset.asObservable();

  private activeNotificationTabSource = new BehaviorSubject<string>('');
  currentActiveNotificationTab = this.activeNotificationTabSource.asObservable();

  private currentPlanSource = new BehaviorSubject<any>(null);
  currentPlanObserable = this.currentPlanSource.asObservable();

  private shouldMakeHeaderSmallerSubject = new BehaviorSubject<boolean>(false);
  shouldMakeHeaderSmallerObservable = this.shouldMakeHeaderSmallerSubject.asObservable();

  private selectedTabInTeamSubject = new Subject<string>();
  selectedTabInTeamObservable = this.selectedTabInTeamSubject.asObservable();

  constructor() {
  }

  isRefreshingToken(bool: boolean) {
    this.refreshingToken.next(bool);
  }

  changeCurrentReceiveNotification(NotificMsg) {
    this.receiveNotificationSource.next(NotificMsg);
  }

  changeStopTime(runtaskStop) {
    this.receiveStopTimeSource.next(runtaskStop);
  }

  changeStartTime(runtaskStart) {
    this.receiveStartTimeSource.next(runtaskStart);
  }

  changePausedTime(runtaskPause) {
    this.receivePausedTimeSource.next(runtaskPause);
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeProject(project: ProjectDTO) {
    this.projectSource.next(project);
  }

  changeProjectNumber(projectNumber: number) {
    this.projectNumberSource.next(projectNumber);
  }

  changeTeamTaskNumber(taskNumber: number) {
    this.teamTaskNumberSource.next(taskNumber);
  }

  changeTaskNumber(taskNumber: number) {
    this.taskNumberSource.next(taskNumber);
  }

  getTasksNumber() {
    return this.taskNumberSource.value;
  }

  changeTeam(team: TeamDTO) {
    this.teamSource.next(team);
  }

  changeProjectTypeViewer(type: string) {
    this.projectTypeSource.next(type);
  }

  changeProjectTasks(project: ProjectDTO) {
    this.projectTasksSource.next(project);
  }

  changeTeamTasks(team: TeamDTO) {
    this.teamTasksSource.next(team);
  }

  changeNewDepartment(dep: DepartmentDTO) {
    this.newDepartmentSource.next(dep);
  }

  changeNewDepartmentMembers(obj: any) {
    this.newDepartmentMembersSource.next(obj);
  }

  changeIsPersonalSelected(b: boolean) {
    this.isPersonalSelectedSource.next(b);
  }

  changeIsPersonalProjectsSelected(b: boolean) {
    this.isPersonalProjectsSelectedSource.next(b);
  }

  changeIsAllTasksSelected(b: boolean) {
    this.isAllTasksSelectedSource.next(b);
  }

  changeAddingTask(t: GeneralTaskDTO) {
    this.addingTaskSource.next(t);
  }

  changeSearchedTask(searchValue: string) {
    this.searchedTaskSource.next(searchValue);
  }

  changeEnabledFilters(enabledFilters: BaseFilterModel[]) {
    this.enabledFiltersSource.next(enabledFilters);
  }

  changeAndOr(andOr: boolean) {
    this.andOrSource.next(andOr);
  }

  changeSettingsTab(tab: string) {
    this.receiveSettingsTabSource.next(tab);
  }

  changeDirection(direction: string) {
    this.receiveDirection.next(direction);
  }

  changeSortName(sortName: string) {
    this.sortNameSource.next(sortName);
  }

  changeIsAscending(isAscending: boolean) {
    this.isAscendingSource.next(isAscending);
  }

  updateProfilePic(date: Date) {
    this.updateProfilePicBehavior.next(date);
  }

  changeLanguage() {
    this.changeLanguageBehavior.next(true);
  }

  changeGetTaskApisFinished(b: boolean) {
    this.getTaskApisFinishedSource.next(b);
  }

  changeTaskComment(hc: HubCommentResponseModel) {
    this.taskCommentSource.next(hc);
  }

  changeTaskCreated(ht: GeneralTaskDTO) {
    this.taskCreatedSource.next(ht);
  }

  changeTaskUpdated(ht: HubEditTaskResponseModel) {
    this.taskUpdatedSource.next(ht);
  }

  changeTaskDeleted(id: number) {
    this.taskDeletedSource.next(id);
  }

  sendTasks(tasks: GeneralTaskDTO[]) {
    this.taskToLeftNavBarBehavior.next(tasks);
  }

  updateOffsets(offsets) {
    this.updateTimelinesOffset.next(offsets);
  }

  changeActiveNotificationTab(tab: string) {
    this.activeNotificationTabSource.next(tab);
  }

  sendCurrentPlan(obj: { planId: number, planName: string }) {
    this.currentPlanSource.next(obj);
  }

  changeCurrentCheckListItemCreated(item: ChecklistItemDTO) {
    this.checkListItemCreatedSource.next(item);
  }

  changeCurrentCheckListItemUpdated(item: ChecklistItemDTO) {
    this.checkListItemUpdatedSource.next(item);
  }

  changeCurrentCheckListItemDeleted(item) {
    this.checkListItemDeletedSource.next(item);
  }

  changeCurrentTaskAssigneesAdded(obj: { id: number, failedAssigns: UserDTO[], successAssigns: UserDTO[] }) {
    this.taskAssigneesAddedSource.next(obj);
  }

  changeCurrentTaskAttachmentAdded(obj: { taskId: number, attachments: FileDTO[] }) {
    this.taskAttachmentAddedSource.next(obj);
  }

  changeCurrentTaskAttachmentDeleted(obj: { taskId: number, fileContainerId: number, fileContainerGuid: string }) {
    this.taskAttachmentDeletedSource.next(obj);
  }

  changeCurrentTaskEstimationAdded(obj: { taskId: number, estimationInMinutes: number, user: UserDTO }) {
    this.taskEstimationAddedSource.next(obj);
  }

  changeCurrentTaskEstimationUpdated(obj: { taskId: number, estimationInMinutes: number, userId: string }) {
    this.taskEstimationUpdatedSource.next(obj);
  }

  changeCurrentTaskEstimationDeleted(obj: { taskId: number, estimationInMinutes: number, userId: string }) {
    this.taskEstimationDeletedSource.next(obj);
  }

  changeCurrentTaskStatusUpdated(obj: { id: number, taskStatusId: number, order: number }) {
    this.taskStatusUpdatedSource.next(obj);
  }

  makeHeaderSmaller(bool: boolean) {
    this.shouldMakeHeaderSmallerSubject.next(bool);
  }

  changeSelectedTabInTeam(tab: string) {
    this.selectedTabInTeamSubject.next(tab);
  }

  changeTagFromInspector(tag: string) {
    this.tagFromInspectorSource.next(tag);
  }
}
