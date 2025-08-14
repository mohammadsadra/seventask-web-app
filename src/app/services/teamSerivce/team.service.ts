import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateTeamDTO} from '../../DTOs/team/CreateTeamDTO';
import {HttpClient} from '@angular/common/http';
import {EditTeamDTO} from '../../DTOs/team/EditTeamDTO';
import {AddUserToProjectDTO} from '../../DTOs/user/AddUserToProjectDTO';
import {AddUserToTeamDTO} from '../../DTOs/user/AddUserToTeamDTO';
import {BaseResponseModel} from '../../DTOs/responseModel/BaseResponseModel';
import { PaymentHistoryDTO } from 'src/app/DTOs/team/PaymentHistoryDTO';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient) {
  }

  createTeam(CreatTeam: CreateTeamDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Team/create', CreatTeam);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/create',
        CreatTeam
      );
    }
  }

  getAllTeam(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getAll');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/getAll'
      );
    }
  }

  getNumberOfTeams(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getNumberOfTeams');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/getNumberOfTeams'
      );
    }
  }

  getTeam(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/get?id=' + id);
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/get?id=' + id
      );
    }
  }

  getDepartmentByTeamId(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getDepartments?id=' + id);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/getDepartments?id=' +
        id
      );
    }
  }

  createLink(teamId: number, packageId: number, seatCount: number, isYearly: boolean): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<BaseResponseModel>(
        '/en-US/Team/createPaymentLink?id=' + teamId + '&packageId=' + packageId + '&seatCount=' + seatCount + '&isYearly=' + isYearly, {}
      );
    } else {
      return this.http.post<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/createPaymentLink?id=' +
        teamId +
        '&packageId=' +
        packageId +
        '&seatCount=' + seatCount +
        '&isYearly=' + isYearly, {}
      );
    }
  }

  createLinkForBill(paymentId: number): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<BaseResponseModel>(
        '/en-US/Team/createLinkForBill?paymentId=' + paymentId, {}
      );
    } else {
      return this.http.post<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/createLinkForBill?paymentId=' + paymentId, {}
      );
    }
  }

  getTeamBasePlans(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<BaseResponseModel>(
        '/en-US/Team/getTeamBasePlans');
    } else {
      return this.http.get<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/getTeamBasePlans');
    }
  }

  getTeamPlanAndResourcesUsed(teamId: number): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<BaseResponseModel>(
        `/en-US/Team/getTeamPlanAndResourcesUsed?id=${teamId}`);
    } else {
      return this.http.get<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        `/Team/getTeamPlanAndResourcesUsed?id=${teamId}`);
    }
  }

  getPaymentHistory(teamId: number): Observable<PaymentHistoryDTO[]> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<PaymentHistoryDTO[]>(
        `/en-US/Team/getPaymentHistory?id=${teamId}`);
    } else {
      return this.http.get<PaymentHistoryDTO[]>(
        '/' +
        localStorage.getItem('languageCode') +
        `/Team/getPaymentHistory?id=${teamId}`);
    }
  }

  checkPayment(teamId: number, paymentAuth): Observable<BaseResponseModel> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<BaseResponseModel>(
        '/en-US/Team/checkPayment?id=' + teamId + '&paymentAuth=' + paymentAuth
        , {});
    } else {
      return this.http.put<BaseResponseModel>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/checkPayment?id=' +
        teamId +
        '&paymentAuth=' +
        paymentAuth
        , {});
    }
  }

  deleteTeam(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>('/en-US/Team/delete?id=' + id);
    } else {
      return this.http.delete<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/delete?id=' + id
      );
    }
  }

  isNameOfGroupUsed(name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Team/isNameOfGroupUsed', name);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/isNameOfGroupUsed',
        name
      );
    }
  }

  updateTeamName(id, name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Team/updateTeamName?id=' + id, {
        value: name,
      });
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/updateTeamName?id=' +
        id,
        {value: name}
      );
    }
  }

  updateTeamColor(id, color): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Team/updateTeamColor?id=' + id, {
        value: color,
      });
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/updateTeamColor?id=' +
        id,
        {value: color}
      );
    }
  }

  updateTeamDescription(id, name): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Team/updateTeamDescription?id=' + id, {
        value: name,
      });
    } else {
      // tslint:Disable-next-line:max-line-length
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/updateTeamDescription?id=' +
        id,
        {value: name}
      );
    }
  }

  getTeammates(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getTeammates?id=' + Id);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/getTeammates?id=' +
        Id
      );
    }
  }

  getUsersCanBeAddedToTeam(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getAllTeamMates');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/getAllTeamMates'
      );
    }
  }

  getTeamHistory(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getTeamHistory?id=' + Id);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/getTeamHistory?id=' +
        Id
      );
    }
  }

  getProjects(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getProjects?id=' + Id);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/getProjects?id=' +
        Id
      );
    }
  }

  getTasks(Id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getTasks?id=' + Id);
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Team/getTasks?id=' + Id
      );
    }
  }

  addMembersToTeam(user: AddUserToTeamDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<AddUserToTeamDTO>(
        '/en-US/Team/addMembersToTeam',
        user
      );
    } else {
      return this.http.post<AddUserToTeamDTO>(
        '/' + localStorage.getItem('languageCode') + '/Team/addMembersToTeam',
        user
      );
    }
  }

  deleteTeamMember(teamId, userId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>(
        '/en-US/Team/deleteTeamMember?id=' + teamId + '&userId=' + userId
      );
    } else {
      return this.http.delete<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Team/deleteTeamMember?id=' +
        teamId +
        '&userId=' +
        userId
      );
    }
  }
}
