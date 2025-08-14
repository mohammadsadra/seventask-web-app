import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateTeamDTO} from '../../DTOs/team/CreateTeamDTO';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InviteLinkHandlerService {

  constructor(private http: HttpClient) {
  }

  validateGuid(guid): any {
    if (guid == null) {
      return null;
    } else {
      if (guid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Team
  joinTeam(guid): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/team/join?guid=' + guid, '');
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/team/join?guid=' + guid, '');
    }
  }

  creatTeamInviteLink(teamID): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Team/createInviteLink?teamId=' + teamID, '');
    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/Team/createInviteLink?teamId=' + teamID, '');
    }
  }

  getAllTeamInviteLinks(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Team/getLinks');
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/Team/getLinks');
    }
  }

  revokeTeamInviteLink(linkID): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Team/revokeLink?id=' + linkID, '');
    } else {
      return this.http.put<any>('/' + localStorage.getItem('languageCode') + '/Team/revokeLink?id=' + linkID, '');
    }
  }
}
