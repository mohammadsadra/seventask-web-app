import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {HttpClient} from '@angular/common/http';
import {CreatProjectDTO} from '../../DTOs/project/CreatProjectDTO';
import {EditprojectDTO} from '../../DTOs/project/EditprojectDTO';
import {AddUserToProjectDTO} from '../../DTOs/user/AddUserToProjectDTO';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {
  }

  getActiveProjects(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/project/getActive');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/project/getActive'
      );
    }
  }

  getNumberOfActiveProjects(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/project/getNumberOfActiveProjects');
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/getNumberOfActiveProjects'
      );
    }
  }

  getProjectById(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/project/get?Id=' + Id);
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/project/get?Id=' + Id
      );
    }
  }

  getProjectMembers(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>(
        '/en-US/project/getProjectMembers?projectId=' + Id
      );
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/getProjectMembers?projectId=' +
        Id
      );
    }
  }

  getUsersCanBeAddedToProjectForNewProjectPage(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/project/getUsersCanBeAddedToProject');
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/getUsersCanBeAddedToProject'
      );
    }
  }

  getProjectHistory(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/project/getProjectHistory?id=' + Id);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/getProjectHistory?id=' +
        Id
      );
    }
  }

  // tslint:Disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:no-shadowed-variable
  creatProject(CreatProjectDTO: CreatProjectDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<CreatProjectDTO>(
        '/en-US/project/create',
        CreatProjectDTO
      );
    } else {
      return this.http.post<CreatProjectDTO>(
        '/' + localStorage.getItem('languageCode') + '/project/create',
        CreatProjectDTO
      );
    }
  }

  addUsersToProject(user: AddUserToProjectDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<AddUserToProjectDTO>(
        '/en-US/project/addUsersToProject',
        user
      );
    } else {
      return this.http.post<AddUserToProjectDTO>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/addUsersToProject',
        user
      );
    }
  }

  removeUserFromProject(projectId, userId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-Us/project/removeUserFromProject?id=' +
        projectId +
        '&userId=' +
        userId
      );
    } else {
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/removeUserFromProject?id=' +
        projectId +
        '&userId=' +
        userId
      );
    }
  }

  updateName(id, name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>(
        '/en-US/project/updateName?id=' + id,
        {'value': name}
      );
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/updateName?id=' +
        id,
        {'value': name}
      );
    }
  }

  updateColor(id, name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>(
        '/en-US/project/updateColor?id=' + id,
        {'value': name}
      );
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/updateColor?id=' +
        id,
        {'value': name}
      );
    }
  }

  updateDescription(id, name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>(
        '/en-US/project/updateDescription?id=' + id,
        {'value': name}
      );
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/project/updateDescription?id=' +
        id,
        {'value': name}
      );
    }
  }

  updateTeamAndDepartments(id: number, teamId: number, departmentIds: number[]): Observable<any> {
    let body = {
      id: id,
      teamId: teamId,
      departmentIds: departmentIds
    };
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/project/updateTeamAndDepartments', body);
    } else {
      return this.http.put<any>('/' + localStorage.getItem('languageCode') + '/project/updateTeamAndDepartments', body);
    }
  }

  deleteProject(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>('/en-US/project/delete?id=' + id);
    } else {
      return this.http.delete<any>(
        '/' + localStorage.getItem('languageCode') + '/project/delete?id=' + id
      );
    }
  }
}
