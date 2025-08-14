import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {UserDTO} from '../../../DTOs/user/UserDTO';
import {ProjectDTO} from '../../../DTOs/project/Project';
import {ProjectHistoryDTO} from '../../../DTOs/project/ProjectHistoryDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../../services/projectService/project.service';
import {TeamDTO} from '../../../DTOs/team/Team.DTO';
import {TeamService} from '../../../services/teamSerivce/team.service';
import {TeamHistoryDTO} from '../../../DTOs/team/TeamHistoryDTO';
import {MainWithInspectorService} from '../../../services/mainWithInspectorService/main-with-inspector.service';
import {DomainName} from '../../../utilities/PathTools';

import {DepartmentDTO} from '../../../DTOs/department/DepartmentDTO';
import {GeneralTaskDTO} from '../../../DTOs/kanban/GeneralTaskDTO';
import {DataService} from '../../../services/dataService/data.service';
import {AddMember} from '../../../primaryPages/sharedComponents/header/projectHeader/project-header.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {HistoryDTO} from '../../../DTOs/history/HistoryDTO';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {AddUserToTeamDTO} from 'src/app/DTOs/user/AddUserToTeamDTO';
import {ParameterDTO} from '../../../DTOs/history/ParameterDTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {ShowMessageInDialogComponent} from '../../../primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {ColorsEnum} from '../../../enums/ColorsEnum';
import {DepartmentService} from '../../../services/departmentService/department.service';
import {ButtonTypeEnum} from '../../../enums/ButtonTypeEnum';
import {DialogMessageEnum} from '../../../enums/DialogMessageEnum';
import {DatePipe} from '@angular/common';
import {AddMemberDialogTypeEnum} from '../../../enums/AddMemberDialogTypeEnum';
import {AddMemberDialogComponent} from '../../../primaryPages/sharedComponents/add-member-dialog/add-member-dialog.component';
import {
  CalendarData,
  CalendarDay,
  CalendarService,
} from 'src/app/services/calendarService/calendar.service';
import {CalendarApiService} from 'src/app/services/calendarService/calendarAPI/calendar-api.service';
import {EventResponseModel} from 'src/app/DTOs/calendar/EventResponseModel';
import * as moment from 'moment';
import {CalendarTypeEnum} from 'src/app/enums/CalendarTypeEnum';
import {CalendarDataService} from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {TeamPlanInfoDTO} from 'src/app/DTOs/team/TeamPlanInfoDTO';
import {PlanInfoDTO} from 'src/app/DTOs/team/PlanInfoDTO';
import {PaymentHistoryDTO} from 'src/app/DTOs/team/PaymentHistoryDTO';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatTableDataSource} from '@angular/material/table';
import { PaymentStatusEnum } from 'src/app/enums/PaymentStatusEnum';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface PaymentHistory {
  id: number;
  selectedPlan: number;
  position: number;
  creator: string;
  creatorGuid: string;
  createdOn: Date;
  validUntil: Date;
  status: number;
  seatCounts: number;
  price: number;
}

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TeamOverviewComponent implements OnInit {
  activeProjects: Array<ProjectDTO> = [];
  members: Array<UserDTO> = [];
  team: TeamDTO = null;
  teamPlanInfo: TeamPlanInfoDTO = null;
  plans: PlanInfoDTO[] = [];
  currentPlanCapacity = 0;
  isUserTheTeamCreator = false;
  teamHistoryArray: Array<HistoryDTO> = [];
  teamDepartments: Array<DepartmentDTO> = [];
  activeDepartment = 'AllDepartment';
  activeDepartmentInMemberSection = 'AllDepartment';
  selectedTask: GeneralTaskDTO;
  teamTasks: Array<GeneralTaskDTO>;
  selectedTab = 'Overview';

  selectedDepartment: DepartmentDTO = null;

  public memberList: Array<any> = [];
  public finalList: Array<any> = [];
  public finalListUserDto: Array<any> = [];
  public mailList: Array<any> = [];
  public userIdList: Array<string> = [];
  public usersList: Array<UserDTO> = [];
  public selectedRemovedUser: UserDTO;
  public myUserGUID = '';

  teamID = this._Activatedroute.snapshot.paramMap.get('id');
  domainName = DomainName;

  selectedProject: ProjectDTO = null;
  projectHover = '';

  removeUser = 'false';
  /* Department Delete & Edit */
  topValue = 0;
  leftValue = 0;
  showContext = false;
  departmentIsSelected: DepartmentDTO = null;
  editableDepartment: boolean[] = [];
  /*  */

  todayDate = moment(new Date()).set({
    h: 23,
    m: 59,
    s: 50,
  });
  visibleDates: CalendarDay[] = [];
  classifiedEventsList: EventResponseModel[][] = [];
  calendarData: CalendarData;
  textDirection = TextDirectionController.getTextDirection();
  paymentHistory: PaymentHistoryDTO[] = [];
  displayedColumns: string[] = ['position', 'creator', 'createdOn', 'price', 'seatCounts', 'validUntil', 'status', 'expand'];
  expandedElement: PaymentHistory | null;
  tableContent: PaymentHistory[] = [];
  gotPaymentHistory = false;
  dataSource = new MatTableDataSource(this.tableContent);
  selectedSort;
  paymentStatusEnum = PaymentStatusEnum;
  isDownloadingPaymentTable = false;
  isDownloadingPaymentDetails = false;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.selectedSort = sort;
    this.dataSource.sort = sort;
  }

  public get calendarType(): typeof CalendarTypeEnum {
    return CalendarTypeEnum;
  }

  constructor(
    private _Activatedroute: ActivatedRoute,
    private teamService: TeamService,
    private router: Router,
    private datePipe: DatePipe,
    private mainWithInspectorService: MainWithInspectorService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private jwtTokenService: JWTTokenService,
    private dataService: DataService,
    private departmentService: DepartmentService,
    public translateService: TranslateService,
    private calendarService: CalendarService,
    private calendarApiService: CalendarApiService,
    private calendarDataService: CalendarDataService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.showSuccessfulPayment();
    }
    this.calendarData = this.calendarService.getCalendarData();
    this.myUserGUID = jwtTokenService.getUserId();
    teamService.getTeamBasePlans().subscribe((res) => {
      this.plans = res;
      teamService.getTeamPlanAndResourcesUsed(Number(this.teamID)).subscribe(res => {
        this.teamPlanInfo = new TeamPlanInfoDTO(res);
        const plan = this.plans.find(p => p.id === this.teamPlanInfo.teamBasePlanId);
        this.dataService.sendCurrentPlan({planId: plan.id, planName: plan.name.toLowerCase()});
        this.currentPlanCapacity = plan.users;
      });
    });
    teamService.getTeam(this.teamID).subscribe((res) => {
      this.team = res.value;
      this.mainWithInspectorService.changeSelectedTeam(res.value);
      this.teamService.getPaymentHistory(this.team.id).subscribe(res => {
        this.paymentHistory = res;
        this.tableContent = [];
        for (let hist of this.paymentHistory) {
          const localizedCreationTime = new Date(CalendarService.convertUtcToLocalTime(hist.createdOn, 'YYYY-MM-DDTHH:mm:ss'));
          const validUntil = hist.isYearly ?
            moment(localizedCreationTime).add(1, 'year').toDate() :
            moment(localizedCreationTime).add(1, 'month').toDate();
          this.tableContent.push({
            id: hist.paymentId,
            selectedPlan: hist.selectedPlan,
            position: this.paymentHistory.indexOf(hist) + 1,
            creator: hist.createdBy ? hist.createdBy.nickName : '-',
            creatorGuid: hist.createdBy ? hist.createdBy.userId : null,
            createdOn: localizedCreationTime,
            price: hist.amount,
            validUntil: validUntil,
            status: hist.statusId,
            seatCounts: hist.seatCounts
          });
        }
        this.dataSource = new MatTableDataSource<PaymentHistory>(this.tableContent);
        this.dataSource.sort = this.selectedSort;
        this.gotPaymentHistory = true;
      });
    });
    teamService.getTeammates(this.teamID).subscribe((res) => {
      for (let a = 0; a < res.value.length; a++) {
        this.members.push(
          new UserDTO(
            res.value[a].nickName,
            res.value[a].userId,
            res.value[a].profileImageGuid
          )
        );
      }
    });
    teamService.getProjects(this.teamID).subscribe((res) => {
      this.activeProjects = res.value;
    });
    teamService.getDepartmentByTeamId(this.teamID).subscribe((res) => {
      this.teamDepartments = res.value;
    });
    teamService.getTasks(this.teamID).subscribe((res) => {
      this.teamTasks = res.value;
      this.dataService.changeTeamTaskNumber(res.value.length);
    });
    teamService.getTeamHistory(this.teamID).subscribe(async (res) => {
      for (let i = 0; i < res.value.length; i++) {
        const temp = res.value[i].time.toString().split('.')[0].split('T');
        const timeChanged = new Date(
          temp[0].split('-')[1] +
          '/' +
          temp[0].split('-')[2] +
          '/' +
          temp[0].split('-')[0] +
          ' ' +
          temp[1].split(':')[0] +
          ':' +
          temp[1].split(':')[1] +
          ':' +
          temp[1].split(':')[2] +
          ' UTC'
        );
        const currentDate = new Date();
        const diffDays = Math.floor(
          (Date.UTC(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            ) -
            Date.UTC(
              timeChanged.getFullYear(),
              timeChanged.getMonth(),
              timeChanged.getDate()
            )) /
          (1000 * 60 * 60 * 24)
        );
        let time;
        if (diffDays === 0) {
          time = this.datePipe.transform(timeChanged, 'H:mm');
        } else if (diffDays < 7) {
          time = diffDays + 'd';
        } else {
          if (Math.floor(diffDays / 7) < 52) {
            time = Math.floor(diffDays / 7) + 'w';
          } else {
            time = Math.floor(diffDays / 7 / 52) + 'y';
          }
        }
        this.teamHistoryArray.push(
          new HistoryDTO(
            await this.stringFormat(
              res.value[i].message,
              res.value[i].parameters
            ),
            time,
            res.value[i].parameters
          )
        );
      }
    });
    // this.dataService.currentDialogMessage.subscribe(message => {
    //   if (message != null) {
    //     if (message === 'yes') {
    //       this.removeMemberFromTeam(this.selectedRemovedUser);
    //     }
    //     this.dataService.changeDialogMessage(null);
    //     this.selectedRemovedUser = null;
    //   }
    // });
    this.fillVisibleDateAndEvents();
  }

  ngOnInit(): void {
    this.dataService.selectedTabInTeamObservable.subscribe((message) => {
      if (message) {
        this.selectedTab = message;
      }
    });

    this.calendarDataService.getDeletedEventId.subscribe((eventId: number) => {
      if (eventId !== null) {
        for (let events of this.classifiedEventsList) {
          for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
            if (events[eventIndex].id === eventId) {
              events = events.splice(eventIndex, 1);
              this.classifiedEventsList = this.classifiedEventsList.slice();
              break;
            }
          }
        }
      }
    });

    // Updating today date each 86400000 ms.
    setTimeout(() => {
      this.todayDate = moment(new Date());
      this.fillVisibleDateAndEvents();
      setInterval(() => {
        this.todayDate = moment(new Date());
        this.fillVisibleDateAndEvents();
      }, 86400000);
    }, 86400000 - (this.todayDate.hours() * 3600000 + this.todayDate.minutes() * 60000 + this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));

    this.dataService.currentDepartment.subscribe((message) => {
      if (message !== null) {
        this.teamDepartments.push(message);
        this.dataService.changeNewDepartment(null);
      }
    });
  }

  async showSuccessfulPayment() {
    this._snackBar.open(await this.translateService.get('Snackbar.successfulPayment').toPromise(),
      await this.translateService.get('Buttons.gotIt').toPromise(),
      {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction:
          TextDirectionController.getTextDirection() === 'ltr'
            ? 'ltr'
            : 'rtl',
      });
  }

  getBillLink($e, paymentId: number) {
    $e.stopPropagation();
    this.teamService.createLinkForBill(paymentId).subscribe((res) => {
      window.location.href = res.value.toString();
    }, async (err) => {
      const errors = [];
      if (err.error) {
        if (err.error.errors) {
          err.error.errors.forEach(error => {
            errors.push(error);
          });
        } else {
          errors.push('Something Went Wrong.');
        }
      } else {
        errors.push('Something Went Wrong.');
      }
      for (let i = 0; i < errors.length; i++) {
        this.openSnackBar(errors[i].toString(), await this.translateService.get('Buttons.gotIt').toPromise());
        await this.delay(2000);
      }
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onRightClick(event, department, index) {
    event.preventDefault();
    this.topValue = event.clientY - 5;
    this.leftValue = event.clientX - 5;
    this.showContext = true;
    this.departmentIsSelected = department;
    this.activeDepartmentInMemberSection = department.id.toString();

    console.log(event);
    console.log(department);
  }

  contextLeave() {
    this.showContext = false;
  }

  departmentEdit() {
    this.showContext = false;
    const index = this.teamDepartments.indexOf(this.departmentIsSelected);
    this.editableDepartment = [];
    this.editableDepartment[index] = true;
  }

  //
  openDepartmentDialog() {
    this.showContext = false;
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteDepartment,
        itemName: this.departmentIsSelected.name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === ButtonTypeEnum.delete) {
        this.departmentDelete();
      }
    });
  }

  downloadPaymentTable(paymentClass: string): void {
    if (paymentClass === 'payment-table') {
      if (this.isDownloadingPaymentTable)
        return;
      this.isDownloadingPaymentTable = true;
    } else if (paymentClass.includes('payment-row')) {
      if (this.isDownloadingPaymentDetails)
        return;
      this.isDownloadingPaymentDetails = true;
    }
    const data = document.querySelectorAll<HTMLElement>('.' + paymentClass);
    if (data) {
      for (let i = 0; i < data.length; i++) {        
        html2canvas(data[i], {scale: 3}).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210; 
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          const pdf = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
          heightLeft -= pageHeight;
    
          while (heightLeft >= 0) {
            position += heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
            heightLeft -= pageHeight;
          }

          if (data.length === i + 1) {
            pdf.save(`${this.team.name}_payment_history.pdf`);
            if (paymentClass === 'payment-table') {
              this.isDownloadingPaymentTable = false;
            } else if (paymentClass.includes('payment-row')) {
              this.isDownloadingPaymentDetails = false;
            }
          }
        });
      }
    }
  }

  departmentDelete() {
    this.departmentService
      .deleteDepartmant(this.departmentIsSelected.id)
      .subscribe(async (res) => {        
        const targetElement = this.teamDepartments.indexOf(
          this.departmentIsSelected
        );
        console.log(targetElement);
        this.teamDepartments.splice(targetElement, 1);
        this.changeActiveDepartmentInMemberSection('AllDepartment');
        this.openSnackBar(
          await this.translateService
          .get('Snackbar.departmentDeleted')
          .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise())
      });
  }

  ConfirmDepartmentName(name) {
    const departmentTargetId = this.departmentIsSelected.id;
    this.departmentService
      .updateDepartmentName(departmentTargetId, name)
      .subscribe((res) => {
        if (res.status === 'Success') {
          const targetElement = this.teamDepartments.indexOf(
            this.departmentIsSelected
          );
          this.teamDepartments[targetElement].name = name;
          this.editableDepartment = [];
        } else {
          console.log(res.message);
        }
      });
  }

  deleteTaskFromList(task) {
    console.log('Task deleted');
    this.teamTasks.splice(this.teamTasks.indexOf(task), 1);
  }

  public get colorsId(): typeof ColorsEnum {
    return ColorsEnum;
  }

  hexToRgba(hex: string) {
    let c;
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    // tslint:Disable-next-line:no-bitwise
    return (
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.1)'
    );
  }

  openProjectOverviewPage(id) {
    this.router.navigateByUrl('project/projectOverview/' + id);
    // [routerLink]="['projectOverview', project.id]"
  }

  changeActiveDepartmentInTaskSection(id) {
    this.activeDepartment = id;
  }

  changeActiveDepartmentInMemberSection(id) {
    this.activeDepartmentInMemberSection = id;
    if (id !== 'AllDepartment') {
      for (let i = 0; i < this.teamDepartments.length; i++) {
        if (
          this.teamDepartments[i].id.toString() ===
          this.activeDepartmentInMemberSection
        ) {
          this.selectedDepartment = this.teamDepartments[i];
          break;
        }
      }
    } else {
      this.selectedDepartment = null;
      this.editableDepartment = [];
    }
  }

  addMember() {
    if (this.activeDepartmentInMemberSection === 'AllDepartment') {
      this.openAddMemberToTeam();
    } else {
      this.openAddMemberToDepartment();
    }
  }

  openAddMemberToTeam(): void {
    this.memberList = [];
    for (let i = 0; i < this.members.length; i++) {
      this.memberList.push(this.members[i]);
    }
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        teamId: this.team.id,
        type: AddMemberDialogTypeEnum.addMemberToTeam,
        memberList: this.memberList,
        mailList: this.mailList,
        isCreator: this.team.createdBy.userId === this.jwtTokenService.getCurrentUserId()
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.userIdList = [];
        this.usersList = [];
        for (let i = 0; i < result[0].length; i++) {
          if (!this.members.find((x) => x.userId === result[0][i].userId)) {
            this.userIdList.push(result[0][i].userId);
            this.usersList.push(result[0][i]);
          }
        }
        this.teamService
          .addMembersToTeam(
            new AddUserToTeamDTO(this.userIdList, result[1], this.team.id)
          )
          .subscribe(async (res) => {
            for (let i = 0; i < this.usersList.length; i++) {
              this.members.push(
                new UserDTO(
                  this.usersList[i].nickName,
                  this.usersList[i].userId,
                  this.usersList[i].profileImageGuid
                )
              );
            }
            if (result[1].length > 0) {
              this.openSnackBar(
                await this.translateService
                  .get('Snackbar.invationEmailsSent')
                  .toPromise(),
                await this.translateService.get('Buttons.gotIt').toPromise()
              );
            }
          });
        this.mailList = [];
      }
    });
  }

  openAddMemberToDepartment(): void {
    this.memberList = [];
    this.finalList = [];
    this.finalListUserDto = [];
    for (let i = 0; i < this.members.length; i++) {
      this.memberList.push(this.members[i]);
    }

    for (let i = 0; i < this.teamDepartments.length; i++) {
      if (
        this.teamDepartments[i].id.toString() ===
        this.activeDepartmentInMemberSection
      ) {
        for (let j = 0; j < this.teamDepartments[i].users.length; j++) {
          for (let z = 0; z < this.memberList.length; z++) {
            if (
              this.memberList[z].userId ===
              this.teamDepartments[i].users[j].userId
            ) {
              this.memberList.splice(z, 1);
            }
          }
        }
        break;
      }
    }
    const dialogRef = this.dialog.open(AddMemberInDepartment, {
      data: {
        memberList: this.memberList,
        finalList: this.finalList,
        finalListUserDto: this.finalListUserDto,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.departmentService
        .addTeammateToDepartment(
          this.finalList,
          this.activeDepartmentInMemberSection
        )
        .subscribe((res) => {
          console.log(this.finalListUserDto);
          this.dataService.changeNewDepartmentMembers({
            kind: 'add',
            list: this.finalListUserDto,
            id: this.activeDepartmentInMemberSection,
          });
          for (let i = 0; i < this.teamDepartments.length; i++) {
            if (
              this.teamDepartments[i].id.toString() ===
              this.activeDepartmentInMemberSection
            ) {
              for (let k = 0; k < this.finalListUserDto.length; k++) {
                this.teamDepartments[i].users.push(this.finalListUserDto[k]);
              }
              break;
            }
          }
        });
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: 'snack-bar-container',
      duration: 2000,
      // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  async stringFormat(msg: string, paramList: Array<ParameterDTO>) {
    for (let i = 0; i < paramList.length; i++) {
      if (paramList[i].parameterType === 1) {
        msg = msg.replace(
          '{' + i + '}',
          '<strong>' + paramList[i].parameterBody + '</strong>'
        );
      } else if (paramList[i].parameterType === 2) {
        const pos = paramList[i].parameterBody.indexOf('NickName');
        const posUserID = paramList[i].parameterBody.indexOf(this.myUserGUID);
        let Slicestr = paramList[i].parameterBody.slice(
          pos + 11,
          paramList[i].parameterBody.indexOf(',') - 1
        );
        if (posUserID !== -1) {
          Slicestr = await this.translateService.get('Team.you').toPromise();
        }
        msg = msg.replace('{' + i + '}', '<strong>' + Slicestr + '</strong>');
        // msg = msg.replace('{' + i + '}', '<strong>' + paramList[i].parameterBody.split('\"')[3] + '</strong>');
      } else if (paramList[i].parameterType === 4) {
        this.translateService
          .get('Color.' + this.colorsId['#' + paramList[i].parameterBody])
          .subscribe((res) => {
            switch (this.colorsId['#' + paramList[i].parameterBody]) {
              case 1:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #7CAC95">' + res + '</strong>'
                );
                break;
              case 2:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #7CA0AC">' + res + '</strong>'
                );
                break;
              case 3:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #977CAC">' + res + '</strong>'
                );
                break;
              case 4:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #AC7C8D">' + res + '</strong>'
                );
                break;
              case 5:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #7C87AC">' + res + '</strong>'
                );
                break;
              case 6:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #A8AC7C">' + res + '</strong>'
                );
                break;
              case 7:
                msg = msg.replace(
                  '{' + i + '}',
                  '<strong  style="color: #74C8BE">' + res + '</strong>'
                );
                break;
            }
          });
      }
    }
    return msg;
  }

  SliceImgString(str: Array<ParameterDTO>) {
    for (let i = 0; i < str.length; i++) {
      const pos = str[i].parameterBody.lastIndexOf('ProfileImageGuid');
      if (pos !== -1) {
        const str1 = str[i].parameterBody.slice(
          pos,
          str[i].parameterBody.length
        );
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
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.remove) {
          this.removeMemberFromTeam(this.selectedRemovedUser);
        }
      }
      this.selectedRemovedUser = null;
    });
  }

  removeMemberFromTeam(member: UserDTO) {
    if (this.activeDepartmentInMemberSection === 'AllDepartment') {
      this.teamService
        .deleteTeamMember(this.team.id, member.userId)
        .subscribe((res) => {
          const index: number = this.members.indexOf(member);
          this.members.splice(index, 1);
          this.teamDepartments.forEach((dep) => {
            const indexOfMember = dep.users.indexOf(member);
            if (indexOfMember >= 0) {
              dep.users.splice(index, 1);
            }
          });
        });
    } else {
      this.departmentService
        .deleteDepartmentMember(
          this.activeDepartmentInMemberSection,
          member.userId
        )
        .subscribe((res) => {
          for (let i = 0; i < this.teamDepartments.length; i++) {
            if (
              this.teamDepartments[i].id.toString() ===
              this.activeDepartmentInMemberSection
            ) {
              const index: number =
                this.teamDepartments[i].users.indexOf(member);
              this.teamDepartments[i].users.splice(index, 1);
              this.dataService.changeNewDepartmentMembers({
                kind: 'remove',
                list: [member],
                id: this.activeDepartmentInMemberSection,
              });
            }
          }
        });
    }
  }

  fillVisibleDateAndEvents() {
    this.classifiedEventsList = [];
    this.calendarService
      .fillVisibleDates(this.todayDate, 'week')
      .then(async (visibleDates: CalendarDay[]) => {
        this.visibleDates = visibleDates;
        let startDate = moment(visibleDates[0].momentDate).add(-1, 'days');
        let endDate = moment(
          visibleDates[visibleDates.length - 1].momentDate
        ).add(1, 'days');
        // this.calendarApiService
        //   .getEventsInPeriod(
        //     startDate.format('YYYY-MM-DD'),
        //     endDate.format('YYYY-MM-DD')
        //   )
        //   .subscribe((events) => {
        //     this.classifiedEventsList = this.calendarService.getEachDayEvents(
        //       events.value,
        //       visibleDates
        //     );
        //     this.classifiedEventsList.forEach((events) => {
        //       events.sort((a, b) =>
        //         moment(a.startTime).diff(moment(b.startTime))
        //       );
        //     });
        //   });
      });
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-member-in-department',
  templateUrl: 'add-member-department.html',
  styleUrls: ['./add-member-department-style.scss'],
})

// tslint:disable-next-line:component-class-suffix
export class AddMemberInDepartment implements OnInit {
  isLoading = false;
  textDirection = TextDirectionController.textDirection;
  members: Array<UserDTO> = [];
  activeTab = 'AddMember';
  search: FormGroup;
  mail: FormGroup;
  mailList = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    // tslint:Disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<AddMember>,
    private _formBuilder: FormBuilder,
    public translateService: TranslateService
  ) {
    // const a = this.inputData.memberList.NewField('jh');
    // console.log(a);
    this.isLoading = true;
    for (let i = 0; i < this.inputData.memberList.length; i++) {
      this.inputData.memberList[i].check = false;
    }
    this.members = this.inputData.memberList;
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]],
    });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      direction:
        TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
    });
  }

  addMember() {
    this.inputData.finalList.length = 0;
    this.inputData.finalListUserDto.length = 0;

    for (let a = 0; a < this.members.length; a++) {
      // @ts-ignore
      if (this.members[a].check) {
        this.inputData.finalList.push(this.members[a].userId);
        this.inputData.finalListUserDto.push(this.members[a]);
      }
    }
  }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  searchFieldChanged(): void {
    console.log(this.search.controls.searchField.value);
    if (this.search.controls.searchField.value) {
      for (let i = 0; i < this.members.length; i++) {
        if (
          !this.members[i].nickName
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
          $('#' + this.members[i].userId).hide();
        }
        if (
          this.members[i].nickName
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
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

@Component({
  selector: 'dialog-department-delete',
  templateUrl: 'dialog-department-delete.html',
})
export class DialogDepertmentDelete {
}
