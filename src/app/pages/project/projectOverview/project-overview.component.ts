import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../services/projectService/project.service';
import {UserDTO} from '../../../DTOs/user/UserDTO';
import {ProjectDTO} from '../../../DTOs/project/Project';
import {MainWithInspectorService} from '../../../services/mainWithInspectorService/main-with-inspector.service';
import {DomainName} from '../../../utilities/PathTools';
import {AddMember} from '../../../primaryPages/sharedComponents/header/projectHeader/project-header.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddUserToProjectDTO} from '../../../DTOs/user/AddUserToProjectDTO';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {HistoryDTO} from '../../../DTOs/history/HistoryDTO';
import {ParameterDTO} from 'src/app/DTOs/history/ParameterDTO';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as $ from 'jquery';
import {DatePipe} from '@angular/common';
import {ShowMessageInDialogComponent} from '../../../primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {ColorsEnum} from '../../../enums/ColorsEnum';
import {ButtonTypeEnum} from '../../../enums/ButtonTypeEnum';
import {DialogMessageEnum} from '../../../enums/DialogMessageEnum';
import {AddMemberDialogTypeEnum} from '../../../enums/AddMemberDialogTypeEnum';
import {AddMemberDialogComponent} from '../../../primaryPages/sharedComponents/add-member-dialog/add-member-dialog.component';

export interface DialogData {
  res: string;
}

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  members: Array<UserDTO> = [];
  project: ProjectDTO = null;
  projectHistoryArray: Array<HistoryDTO> = [];

  NotificDate: any;
  LastNotificDate: string;
  Today: string;
  TimeZone: number;

  projectID = this._Activatedroute.snapshot.paramMap.get('id');

  public memberList: Array<any> = [];

  domainName = DomainName;

  public userIdList: Array<string> = [];
  public usersList: Array<UserDTO> = [];

  public selectedRemovedUser: UserDTO;

  public myUserGUID: string;

  removeUser = 'false';

  constructor(private _Activatedroute: ActivatedRoute,
              private projectService: ProjectService,
              public dialog: MatDialog,
              private datePipe: DatePipe,
              private jwtTokenService: JWTTokenService,
              private mainWithInspectorService: MainWithInspectorService,
              public translateService: TranslateService) {
    this.myUserGUID = jwtTokenService.getUserId();
    projectService.getProjectMembers(this.projectID).subscribe(res => {
      for (let a = 0; a < res.value.length; a++) {
        this.members.push(new UserDTO(
          res.value[a].nickName,
          res.value[a].userId,
          res.value[a].profileImageGuid));
      }
    });
    projectService.getProjectById(this.projectID).subscribe(res => {
      this.project = res;
      this.mainWithInspectorService.changeSelectedProject(this.project);
    });
    projectService.getProjectHistory(this.projectID).subscribe(async res => {
      for (let i = 0; i < res.value.length; i++) {
        const temp = res.value[i].time.toString().split('.')[0].split('T');
        const timeChanged = new Date(temp[0].split('-')[1] + '/' +
          temp[0].split('-')[2] + '/' +
          temp[0].split('-')[0] + ' ' +
          temp[1].split(':')[0] + ':' +
          temp[1].split(':')[1] + ':' +
          temp[1].split(':')[2] + ' UTC');
        const currentDate = new Date();
        const diffDays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(timeChanged.getFullYear(), timeChanged.getMonth(), timeChanged.getDate())) / (1000 * 60 * 60 * 24));
        let time;
        if (diffDays === 0) {
          time = this.datePipe.transform(timeChanged, 'H:mm');
        } else if (diffDays < 7) {
          time = diffDays + 'd';
        } else {
          if (Math.floor(diffDays / 7) < 52) {
            time = Math.floor(diffDays / 7) + 'w';
          } else {
            time = Math.floor((diffDays / 7) / 52) + 'y';
          }
        }
        this.projectHistoryArray.push(
          new HistoryDTO(await this.stringFormat(res.value[i].message, res.value[i].parameters), time, res.value[i].parameters)
        );
      }
    });
  }

  ngOnInit(): void {
    this.mainWithInspectorService.currentProject.subscribe(message => {
      this.project = message;
    });
  }

  public get colorsId(): typeof ColorsEnum {
    return ColorsEnum;
  }

  openAddMember(): void {

    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToProject,
        memberList: this.members,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.userIdList = [];
        this.usersList = [];
        for (let i = 0; i < result[0].length; i++) {
          if (!this.members.find(x => x.userId === result[0][i].userId)) {
            this.userIdList.push(result[0][i].userId);
            this.usersList.push(result[0][i]);
          }
        }
        if (this.userIdList.length > 0) {
          this.projectService.addUsersToProject(new AddUserToProjectDTO(this.userIdList, this.project.id)).subscribe(res => {
            for (let i = 0; i < this.usersList.length; i++) {
              this.members.push(new UserDTO(this.usersList[i].nickName, this.usersList[i].userId, this.usersList[i].profileImageGuid));
            }
          });
        }
      }
    });
  }

  openDeleteDialog(member: UserDTO) {
    this.selectedRemovedUser = member;
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      // height: '400px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.remove, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.removeMember,
        itemName: member.nickName,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === ButtonTypeEnum.remove) {
          this.removeMemberFromProject(this.selectedRemovedUser);
        }
      }
      this.selectedRemovedUser = null;
    });
  }

  // stringFormat(msg, paramList: Array<ParameterDTO>) {
  //   let message = String.Format(msg, '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}', '{thisX}');
  //   console.log(message);
  //   // @ts-ignore
  //   message = message.split('{thisX}');
  //   console.log(message);
  //   const finalMessage = new StringBuilder('');
  //   for (let i = 0; i < message.length; i++) {
  //     if (i + 1 !== message.length) {
  //       finalMessage.Append(message[i]);
  //       if (paramList[i].parameterType === 1) {
  //         finalMessage.Append(paramList[i].parameterBody);
  //         finalMessage.Append('<strong>' + paramList[i].parameterBody + '</strong>');
  //       } else if (paramList[i].parameterType === 2) {
  //         console.log(paramList[i].parameterBody.split('\"')[3]);
  //          // finalMessage.Append(paramList[i].parameterBody.split('\"')[3]);
  //         finalMessage.Append('<strong>' + paramList[i].parameterBody.split('\"' + '</strong>')[3]);
  //       }
  //     } else {
  //       finalMessage.Append(message[i]);
  //     }
  //   }
  //   return finalMessage.ToString();
  // }

  async stringFormat(msg: string, paramList: Array<ParameterDTO>) {
    for (let i = 0; i < paramList.length; i++) {
      if (paramList[i].parameterType === 1) {
        msg = msg.replace('{' + i + '}', '<strong>' + paramList[i].parameterBody + '</strong>');
      } else if (paramList[i].parameterType === 2) {
        const pos = paramList[i].parameterBody.indexOf('NickName');
        const posUserID = paramList[i].parameterBody.indexOf(this.myUserGUID);
        let Slicestr = paramList[i].parameterBody.slice(pos + 11, paramList[i].parameterBody.indexOf(',') - 1);
        if (posUserID !== -1) {
          Slicestr = await this.translateService.get('Team.you').toPromise();
        }
        msg = msg.replace('{' + i + '}', '<strong>' + Slicestr + '</strong>');
        // msg = msg.replace('{' + i + '}', '<strong>' + paramList[i].parameterBody.split('\"')[3] + '</strong>');
      } else if (paramList[i].parameterType === 4) {
        this.translateService.get('Color.' + this.colorsId['#' + paramList[i].parameterBody]).subscribe(res => {
          switch (this.colorsId['#' + paramList[i].parameterBody]) {
            case 1:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #7CAC95">' + res + '</strong>'
              );
              break;
            case 2:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #7CA0AC">' + res + '</strong>'
              );
              break;
            case 3:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #977CAC">' + res + '</strong>'
              );
              break;
            case 4:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #AC7C8D">' + res + '</strong>'
              );
              break;
            case 5:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #7C87AC">' + res + '</strong>'
              );
              break;
            case 6:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #A8AC7C">' + res + '</strong>'
              );
              break;
            case 7:
              msg = msg.replace(
                '{' + i + '}', '<strong  style="color: #74C8BE">' + res + '</strong>'
              );
              break;
          }
        });
      }
    }
    return msg;
  }

  removeMemberFromProject(member: UserDTO) {
    this.projectService.removeUserFromProject(this.project.id, member.userId).subscribe(res => {
      const index: number = this.members.indexOf(member);
      this.members.splice(index, 1);
    });
  }

  SliceImgString(str: Array<ParameterDTO>) {
    for (let i = 0; i < str.length; i++) {
      const pos = str[i].parameterBody.lastIndexOf('ProfileImageGuid');
      if (pos !== -1) {
        const str1 = str[i].parameterBody.slice(pos, str[i].parameterBody.length);
        const str2 = str1.slice(str1.indexOf(':') + 1, str1.length - 1);
        if (str2 === 'null') {
          return null;
        } else {
          const returnStr = str1.slice(str1.indexOf(':') + 2, str1.length - 2);
          return (
            this.domainName + '/en-US/file/get?id=' + returnStr + '&quality=100'
          );
        }
      }
    }
  }

  checkTime(date, index) {
    this.NotificDate = this.datePipe.transform(date, 'M/d/yy');
    const result = this.TimedifferenceCalc(this.NotificDate);

    if (index === 0) {
      this.LastNotificDate = result;
      return result;
    } else {
      if (result !== this.LastNotificDate) {
        this.LastNotificDate = result;
        return result;
      }
    }
  }

  TimedifferenceCalc(TimeValue) {
    this.Today = this.datePipe.transform(new Date(), 'M/d/yy');
    const TodayNum = Date.parse(this.Today) + this.TimeZone;
    const pastNum = Date.parse(TimeValue) + this.TimeZone;
    const difference = (TodayNum - pastNum) / 1000 / 60 / 60 / 24;

    if (this.Today === TimeValue) {
      return 'Today';
    } else if (difference === 1) {
      return 'Yesterday';
    } else if (difference >= 2 && difference <= 6) {
      return difference + ' days ago';
    } else if (difference >= 7 && difference <= 13) {
      return 'Last week' + ' - ' + this.datePipe.transform(TimeValue, 'yy/M/d');
    } else if (difference >= 14 && difference <= 29) {
      return difference + ' days ago';
    } else if (difference >= 30 && difference <= 59) {
      return (
        'Last month' + ' - ' + this.datePipe.transform(TimeValue, 'yy/M/d')
      );
    } else if (difference >= 60 && difference <= 364) {
      return (
        difference / 30 +
        ' ' +
        'Month ago' +
        ' - ' +
        this.datePipe.transform(TimeValue, 'yy/M/d')
      );
    } else if (difference >= 365) {
      return (
        difference / 365 +
        ' ' +
        'Year ago' +
        ' - ' +
        this.datePipe.transform(TimeValue, 'yy/M/d')
      );
    }
  }

  // ShowIntimeZone(value) {
  //   let Time_clac = Date.parse(value) + this.TimeZone;
  //   let Time_out = new Date(Time_clac);
  //   return Time_out;
  // }

}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-member-to-creadted-project',
  templateUrl: 'AddMember.html',
  styleUrls: ['./AddMemberStyle.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class AddMemberToCreatedProject implements OnInit {
  members;
  search: FormGroup;
  tempList = [];

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private projectService: ProjectService,
              public dialogRef: MatDialogRef<AddMember>,
              private _formBuilder: FormBuilder,
              public translateService: TranslateService) {


    this.projectService.getUsersCanBeAddedToProjectForNewProjectPage().subscribe(res => {
      this.members = res.value;
      this.members.NewField = 'check';
      for (let a = 0; a < this.inputData.memberList.length; a++) {
        for (let b = 0; b < this.members.length; b++) {
          if (this.members[b].userId === this.inputData.memberList[a].userId) {
            this.members[b].check = true;
          }
        }
      }
      for (let b = 0; b < this.members.length; b++) {
        if (!this.members[b].check) {
          this.tempList.push(this.members[b]);
        }
      }
      this.members = [];
      this.members = this.tempList;
    });
  }

  ngOnInit(): void {
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]]
    });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  addMember() {
    // for (let a = 0; a < this.inputData.teamDepartments.length; a++) {
    //   this.inputData.teamDepartments.empty();
    // }
    this.inputData.memberList.length = 0;
    for (let a = 0; a < this.members.length; a++) {
      if (this.members[a].check) {
        this.inputData.memberList.push(this.members[a]);
      }
    }
  }

  searchFieldChanged(): void {
    if (this.search.controls.searchField.value) {
      for (let i = 0; i < this.members.length; i++) {
        if (!this.members[i].nickName.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
          $('#' + this.members[i].userId).hide();
        }
        if (this.members[i].nickName.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
          $('#' + this.members[i].userId).show();
        }
      }
    } else {
      for (let i = 0; i < this.members.length; i++) {
        $('#' + this.members[i].userId).show();
      }
    }
  }
}
