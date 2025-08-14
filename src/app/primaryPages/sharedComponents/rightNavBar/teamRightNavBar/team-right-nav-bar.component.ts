import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { TeamDTO } from '../../../../DTOs/team/Team.DTO';
import { MainWithInspectorService } from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../../../../services/teamSerivce/team.service';
import { DepartmentDTO } from '../../../../DTOs/department/DepartmentDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';
import { TranslateService } from '@ngx-translate/core';
import { JWTTokenService } from '../../../../services/accountService/jwttoken.service';
import { ColorsEnum } from '../../../../enums/ColorsEnum';
import { DirectionService } from '../../../../services/directionService/direction.service';
import { DomainName } from '../../../../utilities/PathTools';
import { CreatNewDepartment } from '../../header/teamHeader/team-header.component';
import { DepartmentService } from '../../../../services/departmentService/department.service';
import { DataService } from '../../../../services/dataService/data.service';
import { TimeTrackService } from '../../../../services/timeTrackService/time-track.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-team-right-nav-bar',
  templateUrl: './team-right-nav-bar.component.html',
  styleUrls: ['./team-right-nav-bar.component.scss'],
  animations: [
    trigger('showHideButton', [
      state(
        'show',
        style({
          opacity: 1,
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
        })
      ),
      transition('hide => show', animate('0.1s ease-in')),
      transition('show => hide', animate('0.1s ease-out')),
    ]),
  ],
})
export class TeamRightNavBarComponent implements OnInit {
  constructor(
    private mainWithInspectorService: MainWithInspectorService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private directionService: DirectionService,
    public translateService: TranslateService,
    private jwtTokenService: JWTTokenService,
    private departmentService: DepartmentService,
    private timeTrackService: TimeTrackService
  ) {
    this.myUserGUID = jwtTokenService.getUserId();
  }

  public get colorsId(): typeof ColorsEnum {
    return ColorsEnum;
  }

  height = window.innerHeight - 85;
  selectedTeamToInspect: TeamDTO = null;

  editTitle = false;
  editTitleClicked = false;

  editDescription = false;
  editDescriptionClicked = false;

  allDepartments: Array<DepartmentDTO> = [];

  editForm: FormGroup;

  editColor = false;
  editColorClicked = false;

  addMemberToDepartment = false;

  selectedColor = '';
  domainName = DomainName;

  departments: Array<DepartmentDTO> = [];

  iconRotationDegree = TextDirectionController.iconRotationDegree;
  isUserBeta = this.jwtTokenService.isUserBeta();
  isUserTheTeamCreator = false;
  planId = 1;
  planName = 'free';

  public myUserGUID: string = null;

  public confirmDelete: Array<string> = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight - 85;
  }

  ngOnInit(): void {
    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });

    this.dataService.currentPlanObserable.subscribe((planInfo) => {
      if (planInfo) {
        this.planId = planInfo.planId;
        this.planName = planInfo.planName;
      }
    });

    this.mainWithInspectorService.currentTeam.subscribe((message) => {
      this.selectedTeamToInspect = message;
      if (message != null) {
        this.isUserTheTeamCreator =
          this.selectedTeamToInspect.createdBy.userId ===
          this.jwtTokenService.getCurrentUserId();
        this.teamService
          .getDepartmentByTeamId(this.selectedTeamToInspect.id)
          .subscribe((res) => {
            this.allDepartments = res.value;
          });
      }
    });
    this.editForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Description: new FormControl(null),
    });

    this.dataService.currentNewDepartmentMembers.subscribe(
      (message) => {
        if (message !== null) {
          if (message.kind === 'add') {
            for (let i = 0; i < this.allDepartments.length; i++) {
              if (this.allDepartments[i].id.toString() === message.id) {
                for (let k = 0; k < message.list.length; k++) {
                  this.allDepartments[i].users.push(message.list[k]);
                }
                break;
              }
            }
          } else {
            let index;
            for (let i = 0; i < this.allDepartments.length; i++) {
              if (this.allDepartments[i].id.toString() === message.id) {
                for (let k = 0; k < this.allDepartments[i].users.length; k++) {
                  if (
                    this.allDepartments[i].users[k].userId ===
                    message.list[0].userId
                  ) {
                    index = k;
                    break;
                  }
                }
                this.allDepartments[i].users.splice(index, 1);
                break;
              }
            }
          }
          this.dataService.changeNewDepartmentMembers(null);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async teamGoPro() {
    if (!this.isUserTheTeamCreator) {
      this._snackBar.open(
        await this.translateService
          .get('Snackbar.invalidUserToUpgrade')
          .toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise(),
        {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction:
            TextDirectionController.getTextDirection() === 'ltr'
              ? 'ltr'
              : 'rtl',
        }
      );
      return;
    }
    this.router.navigate(['/payment/', this.selectedTeamToInspect.id]);
  }

  isBeta() {
    return this.isUserBeta;
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

  openAddDepartment(): void {
    const dialogRef = this.dialog.open(CreatNewDepartment, {
      data: {
        departments: this.departments,
        teamID: this.selectedTeamToInspect.id,
        newTeam: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      const department = this.departments.pop();
      department.teamId = this.selectedTeamToInspect.id;
      // console.log(department);
      const tempUser = [];
      if (department.users.length > 0) {
        for (let i = 0; i < department.users.length; i++) {
          tempUser.push(department.users[i].userId);
        }
        department.users.length = 0;
        department.users = tempUser;
      }
      this.departmentService.creatDepartment(department).subscribe((res) => {
        this.allDepartments.push(res.value);
        this.dataService.changeNewDepartment(res.value);
      });
    });
  }

  modifyTitle() {
    this.editTitleClicked = false;
    if (
      this.selectedTeamToInspect.name !== this.editForm.controls.Title.value &&
      this.editForm.controls.Title.value.match(/^\s*$/) === null
    ) {
      this.teamService
        .updateTeamName(
          this.selectedTeamToInspect.id,
          this.editForm.controls.Title.value
        )
        .subscribe(
          async (res) => {
            this.selectedTeamToInspect.name =
              this.editForm.controls.Title.value;
            // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.titleChanged')
                .toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          },
          async (error) => {
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.somethingWrong')
                .toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          }
        );
    }
  }

  modifyColor() {
    this.editColorClicked = false;
    if (this.selectedColor !== this.selectedTeamToInspect.color) {
      this.teamService
        .updateTeamColor(this.selectedTeamToInspect.id, this.selectedColor)
        .subscribe(
          async (res) => {
            this.selectedTeamToInspect.color = this.selectedColor;
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.colorChanged')
                .toPromise(),
              await this.translateService.get('Buttons.ok').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          },
          async (error) => {
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.somethingWrong')
                .toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          }
        );
    }
  }

  modifyDescription() {
    this.editDescriptionClicked = false;
    if (
      this.selectedTeamToInspect.description !==
      this.editForm.controls.Description.value
    ) {
      this.teamService
        .updateTeamDescription(
          this.selectedTeamToInspect.id,
          this.editForm.controls.Description.value
        )
        .subscribe(
          async (res) => {
            this.selectedTeamToInspect.description =
              this.editForm.controls.Description.value;
            // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.descriptionChanged')
                .toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          },
          async (error) => {
            this._snackBar.open(
              await this.translateService
                .get('Snackbar.somethingWrong')
                .toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              }
            );
          }
        );
    }
  }

  deleteTeam() {
    this.teamService.deleteTeam(this.selectedTeamToInspect.id).subscribe(
      async (res) => {
        this.selectedTeamToInspect = null;
        this.router.navigateByUrl('team');
        this._snackBar.open(
          await this.translateService.get('Snackbar.deleted').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000, // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
            panelClass: 'snack-bar-container',
          }
        );
      },
      async (error) => {
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.somethingWrong')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction:
              TextDirectionController.getTextDirection() === 'ltr'
                ? 'ltr'
                : 'rtl',
          }
        );
      }
    );
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteTeamVerificationDialog, {
      minWidth: '100px',
      // height: '400px',
      data: {
        dataKey: this.selectedTeamToInspect,
        delete: this.confirmDelete,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.confirmDelete[0] === 'delete') {
        this.deleteTeam();
        this.confirmDelete = [];
      }
    });
  }

  openDownloadExport(item) {
    this.timeTrackService.getTimesheet(item.id).subscribe((response) => {
      const blob: Blob = response.body as Blob;
      const a = document.createElement('a');
      a.download = item.name + '.xlsx';
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-team-verification',
  templateUrl: 'deleteTeam/delete-team.html',
  styleUrls: ['./deleteTeam/delete-team-style.scss'],
})

// tslint:Disable-next-line:component-class-suffix
// tslint:disable-next-line:component-class-suffix
export class DeleteTeamVerificationDialog implements OnInit {
  teamData: TeamDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    // tslint:Disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    public translateService: TranslateService
  ) {
    this.teamData = this.inputData.dataKey;
  }

  ngOnInit(): void {}

  deleteTeam(): void {
    this.inputData.delete.push('delete');
  }
}
