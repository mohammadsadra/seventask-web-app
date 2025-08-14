import {Component, Inject, OnInit} from '@angular/core';
import {AddMember} from '../projectHeader/project-header.component';
import {DataService} from '../../../../services/dataService/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {DepartmentService} from '../../../../services/departmentService/department.service';
import {ProjectService} from '../../../../services/projectService/project.service';
import {DateAdapter} from '@angular/material/core';
import {CreateTeamDTO} from '../../../../DTOs/team/CreateTeamDTO';
import {TeamDTO} from '../../../../DTOs/team/Team.DTO';
import * as $ from 'jquery';
import {CreatDepartmentWithUserDTODTO} from '../../../../DTOs/department/CreatDepartmentWithUserDTO-DTO';
import {CreatDepartmentWithUserGUIDDTO} from '../../../../DTOs/department/CreatDepartmentWithUserGUID-DTO';
import {DomainName} from '../../../../utilities/PathTools';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {TranslateService} from '@ngx-translate/core';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {AddMemberDialogComponent} from '../../add-member-dialog/add-member-dialog.component';
import {AddMemberDialogTypeEnum} from '../../../../enums/AddMemberDialogTypeEnum';
import {fadeInOutAnimation} from 'src/animations/animations';

@Component({
  selector: 'app-team-header',
  templateUrl: './team-header.component.html',
  styleUrls: ['../SCSS/header-style.scss']
})
export class TeamHeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openNewProjectDialog(): void {
    const dialogRef = this.dialog.open(NewTeam, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'new-team',
  templateUrl: 'NewTeam.html',
  styleUrls: ['./NewTeamStyle.scss'],
  animations: [fadeInOutAnimation]

})
// tslint:Disable-next-line:component-class-suffix
export class NewTeam implements OnInit {
  textDirection = TextDirectionController.textDirection;
  activeTab = 'TeamDetails';
  selectedColor = '7CAC95';
  creatTeamForm: FormGroup;
  team: TeamDTO;
  public selectedTeamFromAddTeamComponent: Array<any> = [];
  public departments: Array<CreatDepartmentWithUserDTODTO> = [];
  public memberList: Array<any> = [];
  public mailList: Array<any> = [];
  public AddMemberOrDepartment: Array<any> = [];

  domainName = DomainName;

  iconRotationDegree = TextDirectionController.iconRotationDegree;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              private departmentService: DepartmentService,
              private _formBuilder: FormBuilder,
              private _adapter: DateAdapter<any>,
              private dataService: DataService,
              private directionService: DirectionService,
              public dialog: MatDialog,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.directionService.currentRotation.subscribe(message => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });
    this.creatTeamForm = this._formBuilder.group({
      name: [undefined, Validators.required],
      description: [],
      color: []
    });
    this.dataService.currentTeam.subscribe(team => {
      this.team = team;
    });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  openAddDepartment(): void {
    const dialogRef = this.dialog.open(CreatNewDepartment, {
      data: {
        departments: this.departments,
        // activeTeamId: this.activeTeam
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(this.departments);
    });
  }

  openAddMember(): void {
    const tempMail = [];
    for (let i = 0; i < this.mailList.length; i++) {
      tempMail.push(this.mailList[i]);
    }
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        isCreating: true,
        type: AddMemberDialogTypeEnum.addMemberToTeam,
        memberList: this.memberList,
        mailList: this.mailList
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        for (let i = 0; i < result[0].length; i++) {
          if (!this.memberList.includes(result[0][i])) {
            this.memberList.push(result[0][i]);
          }
        }
        for (let i = 0; i < tempMail.length; i++) {
          if (!this.mailList.includes(tempMail[i])) {
            this.mailList.push(tempMail[i]);
          }
        }
      }
    });
  }

  openAddMemberToDepartment(departmentMembers): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToDepartment,
        memberList: departmentMembers,
        teamID: this.team.id
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        for (let i = 0; i < result[0].length; i++) {
          if (!departmentMembers.includes(result[0][i])) {
            departmentMembers.push(result[0][i]);
          }
        }
      }
    });
  }

  openAddMemberOrDepartment(): void {
    const dialogRef = this.dialog.open(AddMemberOrDepartment, {
      data: {
        AddMemberOrDepartment: this.AddMemberOrDepartment
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.AddMemberOrDepartment[0] === 'member') {
        this.AddMemberOrDepartment.length = 0;
        this.openAddMember();
      } else if (this.AddMemberOrDepartment[0] === 'department') {
        this.AddMemberOrDepartment.length = 0;
        this.openAddDepartment();
      } else {
        this.AddMemberOrDepartment.length = 0;
      }
    });
  }

  // selectTeam(id) {
  //   this.memberList.length = 0;
  //   this.activeTeam = id;
  //   this.teamDepartments.length = 0;
  // }
  //
  // unselectTeam() {
  //   this.activeTeam = '';
  //   this.teamDepartments.length = 0;
  // }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  creatTeam(): void {
    if (this.creatTeamForm.controls.name.value.trim() === '') {
      return;
    }
    const allDepartments: Array<CreatDepartmentWithUserGUIDDTO> = [];
    if (this.departments.length > 0) {
      for (let i = 0; i < this.departments.length; i++) {
        const membersGUID: Array<string> = [];
        if (this.departments[i].users.length > 0) {
          for (let x = 0; x < this.departments[i].users.length; x++) {
            membersGUID.push(this.departments[i].users[x].userId);
            // console.log(this.departments[i].users[x].userId.toString());
          }
        }
        // console.log(membersGUID);
        allDepartments.push(
          new CreatDepartmentWithUserGUIDDTO(
            this.departments[i].name,
            this.departments[i].description,
            this.departments[i].color,
            membersGUID.length ? membersGUID : [],
          )
        );
      }
    }
    const teamMemberGUID: Array<string> = [];
    if (this.memberList.length > 0) {
      for (let x = 0; x < this.memberList.length; x++) {
        teamMemberGUID.push(this.memberList[x].userId);
      }
    }
    const creatTeamData = new CreateTeamDTO(
      this.creatTeamForm.controls.name.value,
      this.creatTeamForm.controls.description.value,
      this.selectedColor,
      teamMemberGUID.length ? teamMemberGUID : [],
      allDepartments ? allDepartments : [],
      this.mailList.length ? this.mailList : []
    );

    this.teamService.createTeam(creatTeamData).subscribe(async res => {
      this.openSnackBar(await this.translateService.get('Snackbar.teamCreated').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
      this.dataService.changeTeam(res.value);
      this.creatTeamForm.reset();
    }, async error => this.openSnackBar(await this.translateService.get('Snackbar.tryAgain').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise()));
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-member-or-department',
  templateUrl: 'AddMemberOrDepartment.html',
  styleUrls: ['./AddMemberOrDepartmentStyle.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class AddMemberOrDepartment implements OnInit {
  textDirection = TextDirectionController.textDirection;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              public dialogRef: MatDialogRef<AddMemberOrDepartment>,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.inputData.AddMemberOrDepartment.length = 0;
  }


  chooseAddMemberOrDepartment(status) {
    this.inputData.AddMemberOrDepartment.length = 0;
    this.inputData.AddMemberOrDepartment.push(status);
  }
}


@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'creat-department',
  templateUrl: 'new-department.html',
  styleUrls: ['./new-department-style.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class CreatNewDepartment implements OnInit {
  textDirection = TextDirectionController.textDirection;
  activeTab = 'DepartmentDetails';
  selectedColor = '7CAC95';
  creatDepartmentForm: FormGroup;
  team: TeamDTO;
  public selectedTeamFromAddTeamComponent: Array<any> = [];
  public departments: Array<any> = [];
  public memberList: Array<any> = [];
  public AddMemberOrDepartment: Array<any> = [];
  domainName = DomainName;
  newTeam = true;
  teamID = null;


  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              private departmentService: DepartmentService,
              private _formBuilder: FormBuilder,
              private _adapter: DateAdapter<any>,
              private dataService: DataService,
              public dialog: MatDialog,
              public translateService: TranslateService) {
    if (inputData.newTeam != null) {
      this.newTeam = inputData.newTeam;
    }
    if (inputData.teamID != null) {
      this.teamID = inputData.teamID;
    }
  }

  ngOnInit(): void {
    this.creatDepartmentForm = this._formBuilder.group({
      name: [, Validators.required],
      description: [],
      color: []
    });
    this.dataService.currentTeam.subscribe(team => {
      this.team = team;
    });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  openAddMember(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToDepartment,
        memberList: this.memberList,
        teamID: this.teamID,
        newTeam: this.newTeam
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        for (let i = 0; i < result[0].length; i++) {
          if (!this.memberList.includes(result[0][i])) {
            this.memberList.push(result[0][i]);
          }
        }
      }
    });
  }

  // selectTeam(id) {
  //   this.memberList.length = 0;
  //   this.activeTeam = id;
  //   this.teamDepartments.length = 0;
  // }
  //
  // unselectTeam() {
  //   this.activeTeam = '';
  //   this.teamDepartments.length = 0;
  // }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  creatDepartment(): void {
    const creatDepartmentData = new CreatDepartmentWithUserDTODTO(
      this.creatDepartmentForm.controls.name.value,
      this.creatDepartmentForm.controls.description.value,
      this.selectedColor,
      this.memberList.length ? this.memberList : []
    );
    this.inputData.departments.push(creatDepartmentData);
    // console.log(creatDepartmentData);

    // this.teamService.createTeam(creatTeamData).subscribe(res => {
    //   this.openSnackBar('Successfully created!', 'Done');
    //   this.dataService.changeTeam(res.value);
    //   this.creatDepartmentForm.reset();
    // }, error => this.openSnackBar('Try Again!', 'Done'));
  }

}
