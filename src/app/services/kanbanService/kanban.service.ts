import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {GeneralTaskPostDTO} from '../../DTOs/kanban/GeneralTaskPostDTO';
import {UsersAssignedToTaskResponseModel} from '../../DTOs/responseModel/UsersAssignedToTaskResponseModel';
import {GetStatusResponseModel} from '../../DTOs/responseModel/GetStatusResponseModel';
import {CreateTaskResponseModel} from '../../DTOs/responseModel/CreateTaskResponseModel';
import {GetUsersCanBeAssignedResponseModel} from '../../DTOs/responseModel/GetUsersCanBeAssignedResponseModel';
import {UpdateStatusResponseModel} from '../../DTOs/responseModel/UpdateStatusResponseModel';
import {CheckListDTO} from '../../DTOs/kanban/CheckListDTO';
import {AddChecklistResponseModel} from '../../DTOs/responseModel/AddChecklistResponseModel';
import {AddChecklistItemResponseModel} from '../../DTOs/responseModel/AddChecklistItemResponseModel';
import {GetRunningTasksResponseModel} from '../../DTOs/responseModel/GetRunningTasksResponseModel';
import {StatusDTO} from '../../DTOs/kanban/StatusDTO';
import {BaseResponseModel} from '../../DTOs/responseModel/BaseResponseModel';
import {AddStatusResponseModel} from '../../DTOs/responseModel/AddStatusResponseModel';
import {AssignTaskDTO} from '../../DTOs/kanban/AssignTaskDTO';
import {PriorityDTO} from '../../DTOs/kanban/PriorityDTO';
import {AddAttachmentDTO} from '../../DTOs/kanban/AddAttachmentDTO';
import {GetTaskCommentsResponseModel} from '../../DTOs/responseModel/GetTaskCommentsResponseModel';
import {TaskCommentPostDTO} from '../../DTOs/kanban/TaskCommentPostDTO';
import {AddTaskCommentResponseModel} from '../../DTOs/responseModel/AddTaskCommentResponseModel';
import {ChecklistItemPostDTO} from '../../DTOs/kanban/ChecklistItemPostDTO';
import {GetTaskHistoryResponseModel} from '../../DTOs/responseModel/GetTaskHistoryResponseModel';
import {AddTagDTO} from '../../DTOs/kanban/AddTagDTO';
import { ReminderModel } from 'src/app/DTOs/kanban/ReminderModel';
import { MainResponseModel } from 'src/app/DTOs/responseModel/MainResponseModel';
import { ReminderResponseModel } from 'src/app/DTOs/kanban/ReminderResponseModel';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  constructor(private http: HttpClient) {
  }

  getStatuses(
    teamId?: number,
    projectId?: number
  ): Observable<GetStatusResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      if (teamId != null && projectId != null) {
        return this.http.get<GetStatusResponseModel>(
          '/en-US/Task/getStatuses?projectId=' + projectId + '&teamId=' + teamId
        );
      } else if (teamId == null && projectId != null) {
        return this.http.get<GetStatusResponseModel>(
          '/en-US/Task/getStatuses?projectId=' + projectId
        );
      } else if (teamId != null && projectId == null) {
        return this.http.get<GetStatusResponseModel>(
          '/en-US/Task/getStatuses?teamId=' + teamId
        );
      } else {
        return this.http.get<GetStatusResponseModel>('/en-US/Task/getStatuses');
      }
      return this.http.get<GetStatusResponseModel>('/en-US/Task/getStatuses');
    } else {
      if (teamId != null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.get<GetStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getStatuses?projectId=' +
          projectId +
          '&teamId=' +
          teamId
        );
      } else if (teamId == null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.get<GetStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getStatuses?projectId=' +
          projectId
        );
      } else if (teamId != null && projectId == null) {
        return this.http.get<GetStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getStatuses?teamId=' +
          teamId
        );
      } else {
        return this.http.get<GetStatusResponseModel>(
          '/' + localStorage.getItem('languageCode') + '/Task/getStatuses'
        );
      }
    }
  }

  getAllStatuses(): Observable<StatusDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<StatusDTO[]>('/en-US/Task/getAllStatuses');
    } else {
      return this.http.get<StatusDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getAllStatuses'
      );
    }
  }

  getTasks(): Observable<GeneralTaskDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GeneralTaskDTO[]>('/en-US/Task/get');
    } else {
      return this.http.get<GeneralTaskDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/get'
      );
    }
  }

  getComments(taskId: number): Observable<GetTaskCommentsResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GetTaskCommentsResponseModel>(
        '/en-US/Task/getComments?id=' + taskId
      );
    } else {
      return this.http.get<GetTaskCommentsResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/getComments?id=' +
        taskId
      );
    }
  }

  getTaskHistory(taskId: number): Observable<GetTaskHistoryResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GetTaskHistoryResponseModel>(
        '/en-US/Task/getTaskHistory?id=' + taskId
      );
    } else {
      return this.http.get<GetTaskHistoryResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/getTaskHistory?id=' +
        taskId
      );
    }
  }

  getNumberOfTasks(): Observable<GeneralTaskDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GeneralTaskDTO[]>('/en-US/Task/getNumberOfTasks');
    } else {
      return this.http.get<GeneralTaskDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getNumberOfTasks'
      );
    }
  }

  getNumberOfTasksInEachProioritiy(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Task/getNumberOfTasksInEachProioritiy');
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/getNumberOfTasksInEachProioritiy'
      );
    }
  }

  getUrgentTasks(): Observable<GeneralTaskDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GeneralTaskDTO[]>('/en-US/Task/getUrgentTasks');
    } else {
      return this.http.get<GeneralTaskDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getUrgentTasks'
      );
    }
  }

  getArchivedTasks(): Observable<GeneralTaskDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GeneralTaskDTO[]>('/en-US/Task/getArchived');
    } else {
      return this.http.get<GeneralTaskDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getArchived'
      );
    }
  }

  getRunningTasks(): Observable<GetRunningTasksResponseModel[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GetRunningTasksResponseModel[]>(
        '/en-US/Task/getRunningTasks'
      );
    } else {
      return this.http.get<GetRunningTasksResponseModel[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getRunningTasks'
      );
    }
  }

  getFollowedTasks(): Observable<GeneralTaskDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GeneralTaskDTO[]>(
        '/en-US/Task/getFollowedTasks'
      );
    } else {
      return this.http.get<GeneralTaskDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getFollowedTasks'
      );
    }
  }

  getTaskPriorities(): Observable<PriorityDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<PriorityDTO[]>('/en-US/Task/getTaskPriorities');
    } else {
      return this.http.get<PriorityDTO[]>(
        '/' + localStorage.getItem('languageCode') + '/Task/getTaskPriorities'
      );
    }
  }

  getUsersAssignedTo(): Observable<UsersAssignedToTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<UsersAssignedToTaskResponseModel>(
        '/en-US/Task/getUsersAssignedTo'
      );
    } else {
      return this.http.get<UsersAssignedToTaskResponseModel>(
        '/' + localStorage.getItem('languageCode') + '/Task/getUsersAssignedTo'
      );
    }
  }

  getUsersCanBeAssigned(
    teamId?: number,
    projectId?: number
  ): Observable<GetUsersCanBeAssignedResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      if (
        (teamId != null && projectId != null) ||
        (teamId == null && projectId != null)
      ) {
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/en-US/Task/getUsersCanBeAssigned?projectId=' + projectId
        );
      } else if (teamId != null && projectId == null) {
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/en-US/Task/getUsersCanBeAssigned?teamId=' + teamId
        );
      } else {
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/en-US/Task/getUsersCanBeAssigned'
        );
      }
    } else {
      if (
        (teamId != null && projectId != null) ||
        (teamId == null && projectId != null)
      ) {
        // tslint:Disable-next-line:max-line-length
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getUsersCanBeAssigned?projectId=' +
          projectId
        );
      } else if (teamId != null && projectId == null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getUsersCanBeAssigned?teamId=' +
          teamId
        );
      } else {
        // tslint:Disable-next-line:max-line-length
        return this.http.get<GetUsersCanBeAssignedResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/getUsersCanBeAssigned'
        );
      }
    }
  }

  getTasksUsers(): Observable<GetUsersCanBeAssignedResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<GetUsersCanBeAssignedResponseModel>(
        '/en-US/Task/getTasksUsers?forAll=true'
      );
    } else {
      return this.http.get<GetUsersCanBeAssignedResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/getTasksUsers?forAll=true'
      );
    }
  }

  addTask(addingTask: GeneralTaskPostDTO): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<CreateTaskResponseModel>(
        '/en-US/Task/create',
        addingTask
      );
    } else {
      return this.http.post<CreateTaskResponseModel>(
        '/' + localStorage.getItem('languageCode') + '/Task/create',
        addingTask
      );
    }
  }

  addComment(
    comment: TaskCommentPostDTO
  ): Observable<AddTaskCommentResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<AddTaskCommentResponseModel>(
        '/en-US/Task/addComment',
        comment
      );
    } else {
      return this.http.post<AddTaskCommentResponseModel>(
        '/' + localStorage.getItem('languageCode') + '/Task/addComment',
        comment
      );
    }
  }

  addStatus(
    newTitle: string,
    teamId?: number,
    projectId?: number
  ): Observable<AddStatusResponseModel> {
    // console.log(teamId, projectId);
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      if (teamId != null && projectId != null) {
        return this.http.post<AddStatusResponseModel>(
          '/en-US/Task/addStatus?projectId=' + projectId + '&teamId=' + teamId,
          {value: newTitle}
        );
      } else if (teamId == null && projectId != null) {
        return this.http.post<AddStatusResponseModel>(
          '/en-US/Task/addStatus?projectId=' + projectId,
          {value: newTitle}
        );
      } else if (teamId != null && projectId == null) {
        return this.http.post<AddStatusResponseModel>(
          '/en-US/Task/addStatus?teamId=' + teamId,
          {value: newTitle}
        );
      } else {
        return this.http.post<AddStatusResponseModel>('/en-US/Task/addStatus', {
          value: newTitle,
        });
      }
      return this.http.post<AddStatusResponseModel>('/en-US/Task/addStatus', {
        value: newTitle,
      });
    } else {
      if (teamId != null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.post<AddStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/addStatus?projectId=' +
          projectId +
          '&teamId=' +
          teamId,
          {value: newTitle}
        );
      } else if (teamId == null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.post<AddStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/addStatus?projectId=' +
          projectId,
          {value: newTitle}
        );
      } else if (teamId != null && projectId == null) {
        return this.http.post<AddStatusResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/addStatus?teamId=' +
          teamId,
          {value: newTitle}
        );
      } else {
        // tslint:disable-next-line:max-line-length
        return this.http.post<AddStatusResponseModel>(
          '/' + localStorage.getItem('languageCode') + '/Task/addStatus',
          {value: newTitle}
        );
      }
    }
  }

  assignTask(assignTask: AssignTaskDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Task/assignTask', assignTask);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/Task/assignTask',
        assignTask
      );
    }
  }

  addAttachment(addAttachmentDTO: AddAttachmentDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Task/addAttachment', addAttachmentDTO);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/Task/addAttachment',
        addAttachmentDTO
      );
    }
  }

  addTagToTask(addTagDTO: AddTagDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Task/addTagToTask', addTagDTO);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/Task/addTagToTask',
        addTagDTO
      );
    }
  }

  addChecklist(
    taskId: number,
    addingChecklist: CheckListDTO
  ): Observable<AddChecklistResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<AddChecklistResponseModel>(
        '/en-US/Task/addCheckList?id=' + taskId,
        addingChecklist
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.post<AddChecklistResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/addCheckList?id=' +
        taskId,
        addingChecklist
      );
    }
  }

  addChecklistItem(
    taskId: number,
    addingChecklistItem: ChecklistItemPostDTO
  ): Observable<AddChecklistItemResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<AddChecklistItemResponseModel>(
        '/en-US/Task/addCheckListItem?id=' + taskId,
        addingChecklistItem
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.post<AddChecklistItemResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/addCheckListItem?id=' +
        taskId,
        addingChecklistItem
      );
    }
  }

  addTaskEstimationTime(
    taskId: number,
    estimationInMinutes: number
  ): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<BaseResponseModel>(
        '/en-US/Task/addTaskEstimationTime?id=' +
        taskId +
        '&estimationInMinutes=' +
        estimationInMinutes,
        null
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.post<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/addTaskEstimationTime?id=' +
        taskId +
        '&estimationInMinutes=' +
        estimationInMinutes,
        null
      );
    }
  }

  followTask(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>(
        '/en-US/Task/followTask?id=' +
        taskId,
        null
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.post<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/followTask?id=' +
        taskId,
        null
      );
    }
  }

  duplicateTask(taskId: number): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<CreateTaskResponseModel>(
        '/en-US/Task/duplicate?id=' +
        taskId,
        null
      );
    } else {
      return this.http.post<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/duplicate?id=' +
        taskId,
        null
      );
    }
  }

  deleteTask(taskId): Observable<GeneralTaskDTO> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<GeneralTaskDTO>(
        '/en-US/Task/delete?id=' + taskId
      );
    } else {
      return this.http.delete<GeneralTaskDTO>(
        '/' + localStorage.getItem('languageCode') + '/Task/delete?id=' + taskId
      );
    }
  }

  deleteAttachment(taskId, attachmentGuid): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteAttachment?id=' +
        taskId +
        '&attachmentGuid=' +
        attachmentGuid
      );
    } else {
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteAttachment?id=' +
        taskId +
        '&attachmentGuid=' +
        attachmentGuid
      );
    }
  }

  deleteStatus(statusId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteStatus?statusId=' + statusId
      );
    } else {
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteStatus?statusId=' +
        statusId
      );
    }
  }

  deleteUserAssignedTo(
    taskId: number,
    userId: string
  ): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<CreateTaskResponseModel>(
        '/en-US/Task/deleteUserAssignedTo?id=' + taskId + '&userId=' + userId
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteUserAssignedTo?id=' +
        taskId +
        '&userId=' +
        userId
      );
    }
  }

  deleteChecklist(checklistId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteCheckList?checkListId=' + checklistId
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteCheckList?checkListId=' +
        checklistId
      );
    }
  }

  deleteEstimationTime(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteEstimationTime?id=' + taskId
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteEstimationTime?id=' +
        taskId
      );
    }
  }

  deleteChecklistItem(checklistItemId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteCheckListItem?checkListItemId=' + checklistItemId
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/deleteCheckListItem?checkListItemId=' +
        checklistItemId
      );
    }
  }

  deleteTag(taskId: number, title: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        taskId: taskId,
        title: title,
      },
    };
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Task/deleteTagFromTask',
        options
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') + '/Task/deleteTagFromTask', options);
    }
  }

  unfollowTask(id: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>('/en-US/Task/unfollowTask?id=' + id);
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.delete<any>('/' + localStorage.getItem('languageCode') + '/Task/unfollowTask?id=' + id);
    }
  }

  updateStatus(taskId, statusId, order?): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<UpdateStatusResponseModel>(
        order ? '/en-US/Task/updateStatus?id=' + taskId + '&newStatusId=' + statusId + '&order=' + order :
          '/en-US/Task/updateStatus?id=' + taskId + '&newStatusId=' + statusId,
        null
      );
    } else {
      return this.http.put<UpdateStatusResponseModel>(
        order ?
          '/' + localStorage.getItem('languageCode') + '/Task/updateStatus?id=' + taskId + '&newStatusId=' + statusId + '&order=' + order
          :
          '/' + localStorage.getItem('languageCode') + '/Task/updateStatus?id=' + taskId + '&newStatusId=' + statusId,
        null
      );
    }
  }

  updateColStatus(statusId, order): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<UpdateStatusResponseModel>(
        '/Task/updateStatusOrder?statusId=' + statusId + '&order=' + order,
        null
      );
    } else {
      return this.http.put<UpdateStatusResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateStatusOrder?statusId=' +
        statusId +
        '&order=' +
        order,
        null
      );
    }
  }

  updateTaskBoardManualOrder(taskId, newOrder): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<UpdateStatusResponseModel>(
        '/en-US/Task/updateTaskBoardManualOrder?id=' + taskId + '&newOrder=' + newOrder,
        null
      );
    } else {
      return this.http.put<UpdateStatusResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateTaskBoardManualOrder?id=' +
        taskId +
        '&newOrder=' +
        newOrder,
        null
      );
    }
  }

  updateStatusTitle(
    statusId: number,
    newStatus: string
  ): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<BaseResponseModel>(
        '/en-US/Task/updateStatusTitle?statusId=' + statusId,
        {value: newStatus}
      );
    } else {
      return this.http.put<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateStatusTitle?statusId=' +
        statusId,
        {value: newStatus}
      );
    }
  }

  updateTitle(
    taskId: number,
    newTitle: string
  ): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<CreateTaskResponseModel>(
        '/en-US/Task/updateTitle?id=' + taskId,
        {value: newTitle}
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateTitle?id=' +
        taskId,
        {value: newTitle}
      );
    }
  }

  updateDescription(
    taskId: number,
    newDescription: string
  ): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/en-US/Task/updateDescription?id=' + taskId,
        {value: newDescription}
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateDescription?id=' +
        taskId,
        {value: newDescription}
      );
    }
  }

  updatePriority(
    taskId: number,
    newPriority: number
  ): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/en-US/Task/updatePriority?id=' +
        taskId +
        '&newPriority=' +
        newPriority,
        null
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updatePriority?id=' +
        taskId +
        '&newPriority=' +
        newPriority,
        null
      );
    }
  }

  updateUrgent(taskId: number, isUrgent: boolean): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      // tslint:Disable-next-line:max-line-length
      return this.http.put<any>(
        '/en-US/Task/updateUrgent?id=' + taskId + '&isUrgent=' + isUrgent,
        null
      );
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateUrgent?id=' +
        taskId +
        '&isUrgent=' +
        isUrgent,
        null
      );
    }
  }

  updateEstimationTime(
    taskId: number,
    estimationInMinutes: number
  ): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      // tslint:Disable-next-line:max-line-length
      return this.http.put<any>(
        '/en-US/Task/updateEstimationTime?id=' +
        taskId +
        '&estimationInMinutes=' +
        estimationInMinutes,
        null
      );
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateEstimationTime?id=' +
        taskId +
        '&estimationInMinutes=' +
        estimationInMinutes,
        null
      );
    }
  }

  updateTeamAndProject(
    taskId: number,
    teamId?: number,
    projectId?: number
  ): Observable<CreateTaskResponseModel> {
    // console.log(teamId, projectId);
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      if (teamId != null && projectId != null) {
        return this.http.put<CreateTaskResponseModel>(
          '/en-US/Task/updateTeamAndProject?id=' +
          taskId +
          '&projectId=' +
          projectId +
          '&teamId=' +
          teamId,
          null
        );
      } else if (teamId == null && projectId != null) {
        return this.http.put<CreateTaskResponseModel>(
          '/en-US/Task/updateTeamAndProject?id=' +
          taskId +
          '&projectId=' +
          projectId,
          null
        );
      } else if (teamId != null && projectId == null) {
        return this.http.put<CreateTaskResponseModel>(
          '/en-US/Task/updateTeamAndProject?id=' + taskId + '&teamId=' + teamId,
          null
        );
      } else {
        return this.http.put<CreateTaskResponseModel>(
          '/en-US/Task/updateTeamAndProject?id=' + taskId,
          null
        );
      }
      // return this.http.post<AddStatusResponseModel>('/en-US/Task/addStatus', {'value': newTitle});
    } else {
      if (teamId != null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.put<CreateTaskResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/updateTeamAndProject?id=' +
          taskId +
          '&projectId=' +
          projectId +
          '&teamId=' +
          teamId,
          null
        );
      } else if (teamId == null && projectId != null) {
        // tslint:Disable-next-line:max-line-length
        return this.http.put<CreateTaskResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/updateTeamAndProject?id=' +
          taskId +
          '&projectId=' +
          projectId,
          null
        );
      } else if (teamId != null && projectId == null) {
        return this.http.put<CreateTaskResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/updateTeamAndProject?id=' +
          taskId +
          '&teamId=' +
          teamId,
          null
        );
      } else {
        // tslint:disable-next-line:max-line-length
        return this.http.put<CreateTaskResponseModel>(
          '/' +
          localStorage.getItem('languageCode') +
          '/Task/updateTeamAndProject?id=' +
          taskId,
          null
        );
      }
    }
  }

  updateCheckListItemIsChecked(
    checkListItemId: number,
    checked: boolean
  ): Observable<CreateTaskResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<CreateTaskResponseModel>(
        '/en-US/Task/updateCheckListItemIsChecked?checkListItemId=' +
        checkListItemId +
        '&isChecked=' +
        checked,
        null
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<CreateTaskResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateCheckListItemIsChecked?checkListItemId=' +
        checkListItemId +
        '&isChecked=' +
        checked,
        null
      );
    }
  }

  updateCheckListText(
    checkListItemId: number,
    checkListُText: string
  ): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<BaseResponseModel>(
        '/en-US/Task/updateCheckListItemTitle?checkListItemId=' +
        checkListItemId,
        {value: checkListُText}
      );
    } else {
      return this.http.put<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/updateCheckListItemTitle?checkListItemId=' +
        checkListItemId,
        {value: checkListُText}
      );
    }
  }

  editTaskStartDate(id: number, startDate) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/task/updateStartDate?id=${id}&newStartDate=${startDate}`, {});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/task/updateStartDate?id=${id}&newStartDate=${startDate}`, {});
    }
  }

  editTaskEndDate(id: number, endDate) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/task/updateEndDate?id=${id}&newEndDate=${endDate}`, {});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/task/updateEndDate?id=${id}&newEndDate=${endDate}`, {});
    }
  }

  archiveTask(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Task/archive?id=' + taskId, null);
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/archive?id=' +
        taskId,
        null
      );
    }
  }

  archiveStatusTasks(statusId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>(
        '/en-US/Task/archiveStatusTasks?statusId=' + statusId,
        null
      );
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Task/archiveStatusTasks?statusId=' +
        statusId,
        null
      );
    }
  }

  addReminder(reminderModel: ReminderModel): Observable<MainResponseModel<ReminderResponseModel>> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<MainResponseModel<ReminderResponseModel>>('/en-US/TaskReminder/add', reminderModel);
    } else {
      return this.http.post<MainResponseModel<ReminderResponseModel>>('/' + localStorage.getItem('languageCode') +
        '/TaskReminder/add', reminderModel);
    }
  }

  getReminders(taskId: number): Observable<MainResponseModel<ReminderResponseModel[]>> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<MainResponseModel<ReminderResponseModel[]>>('/en-US/TaskReminder/get?taskId=' + taskId);
    } else {
      return this.http.get<MainResponseModel<ReminderResponseModel[]>>('/' + localStorage.getItem('languageCode') +
        '/TaskReminder/get?taskId=' + taskId);
    }
  }

  deleteReminder(reminderId: number): any{
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete('/en-US/TaskReminder/delete?reminderId=' + reminderId);
    } else {
      return this.http.delete('/' + localStorage.getItem('languageCode') +
        '/TaskReminder/delete?reminderId=' + reminderId);
    }
  }
}
