import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreatDepartmentWithUserGUIDDTO } from '../../DTOs/department/CreatDepartmentWithUserGUID-DTO';
import { BaseResponseModel } from '../../DTOs/responseModel/BaseResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  getAllDepartment(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/department/getAll');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/department/getAll'
      );
    }
  }

  getDepartment(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/department/get?id=' + id);
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/department/get?id=' + id
      );
    }
  }

  creatDepartment(DepartmentDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<CreatDepartmentWithUserGUIDDTO>(
        '/en-US/project/department',
        DepartmentDTO
      );
    } else {
      return this.http.post<CreatDepartmentWithUserGUIDDTO>(
        '/' + localStorage.getItem('languageCode') + '/department/create',
        DepartmentDTO
      );
    }
  }

  addTeammateToDepartment(users, id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/department/addTeammateToDepartment', {
        departmentId: parseInt(id, 10),
        users: users,
      });
    } else {
      return this.http.post<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/department/addTeammateToDepartment',
        {
          departmentId: parseInt(id, 10),
          users: users,
        }
      );
    }
  }

  deleteDepartmentMember(id, userId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/department/deleteDepartmentMember?id=' +
          id +
          '&userId=' +
          userId
      );
    } else {
      return this.http.delete<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/department/deleteDepartmentMember?id=' +
          id +
          '&userId=' +
          userId
      );
    }
  }

  deleteDepartmant(deleteId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>('/en-US/Department/delete?id=' + deleteId);
    } else {
      return this.http.delete<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Department/delete?id=' +
          deleteId
      );
    }
  }

  updateDepartmentName(
    departmentId: number,
    departmentName: string
  ): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<BaseResponseModel>(
        '/en-US/Department/updateName?id=' + departmentId,
        { value: departmentName }
      );
    } else {
      return this.http.put<BaseResponseModel>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Department/updateName?id=' +
          departmentId,
        { value: departmentName }
      );
    }
  }
}
