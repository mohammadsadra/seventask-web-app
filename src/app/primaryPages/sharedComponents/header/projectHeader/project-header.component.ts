import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../../../services/dataService/data.service';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {DepartmentService} from '../../../../services/departmentService/department.service';
import {ProjectService} from '../../../../services/projectService/project.service';
import {DateAdapter} from '@angular/material/core';
import {CreatProjectDTO} from '../../../../DTOs/project/CreatProjectDTO';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {DomainName} from '../../../../utilities/PathTools';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {fadeInOutAnimation} from 'src/animations/animations';
import { TeamPlanInfoDTO } from 'src/app/DTOs/team/TeamPlanInfoDTO';
import { JWTTokenService } from 'src/app/services/accountService/jwttoken.service';

@Component({
  selector: 'app-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['../SCSS/header-style.scss']
})
export class ProjectHeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openNewProjectDialog(): void {
    const dialogRef = this.dialog.open(NewProject, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'new-project',
  templateUrl: 'NewProject.html',
  styleUrls: ['./NewProjectStyle.scss'],
  animations: [fadeInOutAnimation]

})
// tslint:Disable-next-line:component-class-suffix
export class NewProject implements OnInit {
  textDirection = TextDirectionController.textDirection;
  activeTab = 'assignments';
  activeTeam = '';
  activeEvent = '';
  allTeams;
  selectedColor = '7CAC95';
  creatProjectForm: FormGroup;
  project: ProjectDTO;
  public selectedTeamFromAddTeamComponent: Array<any> = [];
  public teamDepartments: Array<any> = [];
  public memberList: Array<any> = [];
  shouldUpgradePlan: boolean = false;
  gettingTeamInfo: boolean = false;
  isUserAdmin: boolean = false;

  domainName = DomainName;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  iconRotationDegree = TextDirectionController.iconRotationDegree;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              private departmentService: DepartmentService,
              private projectService: ProjectService,
              private _formBuilder: FormBuilder,
              private _adapter: DateAdapter<any>,
              private dataService: DataService,
              private directionService: DirectionService,
              public dialog: MatDialog,
              private router: Router,
              public translateService: TranslateService,
              private jwtTokenService: JWTTokenService) {
    this.directionService.currentRotation.subscribe(message => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });

    this.teamService.getAllTeam().subscribe(res => {
      this.allTeams = res;      
    });
  }

  ngOnInit(): void {
    this.creatProjectForm = this._formBuilder.group({
      name: [, Validators.required],
      description: [],
      color: [],
      teamId: [],
      departmentId: []
    });
    this.dataService.currentProject.subscribe(project => {
      this.project = project;
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

  openTeamPage() {
    this.router.navigateByUrl('team');
  }

  openAddTeam(): void {
    this.selectedTeamFromAddTeamComponent.length = 0;
    const dialogRef = this.dialog.open(AddTeam, {
      data: {
        activeTeam: this.selectedTeamFromAddTeamComponent
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(this.selectedTeamFromAddTeamComponent);
      this.selectTeam(this.selectedTeamFromAddTeamComponent[0].id);
    });
  }

  openAddDepartment(): void {
    const dialogRef = this.dialog.open(AddDepartment, {
      data: {
        teamDepartments: this.teamDepartments,
        activeTeamId: this.activeTeam
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(this.teamDepartments);
    });
  }

  openAddMember(): void {
    const dialogRef = this.dialog.open(AddMember, {
      data: {
        memberList: this.memberList,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(this.teamDepartments);
    });
  }

  selectTeam(id) {
    this.memberList.length = 0;
    this.activeTeam = id;
    this.teamDepartments.length = 0;
    this.gettingTeamInfo = true;
    this.isUserAdmin = this.jwtTokenService.getCurrentUserId() === this.allTeams.find(team => team.id === id).createdBy.userId;    
    this.teamService.getTeamPlanAndResourcesUsed(id).subscribe(res => {
      const teamPlanInfo = new TeamPlanInfoDTO(res);
      this.shouldUpgradePlan = teamPlanInfo.projects <= teamPlanInfo.usedProjects;      
      this.gettingTeamInfo = false;
    });
  }

  unselectTeam() {
    this.activeTeam = '';
    this.teamDepartments.length = 0;
  }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  async goPro() {
    if (this.isUserAdmin) {
      // this.dialogRef.close();
      this.router.navigate(['/payment/', this.activeTeam]);
    } else {
      this._snackBar.open(await this.translateService.get('Snackbar.invalidUserToUpgrade').toPromise(),
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
  }

  creatProject() {
    if (this.creatProjectForm.controls.name.value.trim() === '') {
      return;
    }
    let departmentsID: Array<number> = [];
    let membersId: Array<number> = [];
    let teamId;
    if (this.activeTeam === '') {
      teamId = null;
    } else {
      teamId = this.activeTeam;
    }
    if (this.teamDepartments.length > 0) {
      for (let a = 0; a < this.teamDepartments.length; a++) {
        departmentsID.push(this.teamDepartments[a].id);
      }
    } else {
      departmentsID = [];
    }
    if (this.memberList.length > 0) {
      for (let a = 0; a < this.memberList.length; a++) {
        membersId.push(this.memberList[a].userId);
      }
    } else {
      membersId = [];
    }
    const newProject = new CreatProjectDTO(
      this.creatProjectForm.controls.name.value,
      this.creatProjectForm.controls.description.value,
      this.dateRange.controls.start.value,
      this.dateRange.controls.end.value,
      this.selectedColor,
      teamId,
      departmentsID,
      membersId
    );
    this.projectService.creatProject(newProject).subscribe(async res => {
      this.creatProjectForm.reset();
      this.dateRange.reset();
      this.dataService.changeProject(res.value);
      this.openSnackBar(await this.translateService.get('Snackbar.projectCreated').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
    }, async err => {
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

  handleChangeComplete(e) {
    this.creatProjectForm.controls.color.setValue(e.color.hex.split('#')[1]);
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-team',
  templateUrl: 'AddTeam.html',
  styleUrls: ['./AddTeamStyle.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class AddTeam implements OnInit {
  textDirection = TextDirectionController.textDirection;
  allTeams;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              private dialogRef: MatDialogRef<AddTeam>,
              public translateService: TranslateService) {

    this.teamService.getAllTeam().subscribe(res => {
      this.allTeams = res;
    });
  }

  ngOnInit(): void {
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  changeActiveTeam(team) {
    if (this.inputData.activeTeam.length !== 0) {
      this.inputData.activeTeam.pop();
    }
    this.inputData.activeTeam.push(team);
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-department',
  templateUrl: 'AddDepartment.html',
  styleUrls: ['./AddDepartmentStyle.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class AddDepartment implements OnInit {
  textDirection = TextDirectionController.textDirection;
  teamDepartments;
  search: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              public dialogRef: MatDialogRef<AddDepartment>,
              private _formBuilder: FormBuilder,
              public translateService: TranslateService) {

    this.teamService.getDepartmentByTeamId(this.inputData.activeTeamId).subscribe(res => {
      this.teamDepartments = res.value;
      this.teamDepartments.NewField = 'check';
      for (let a = 0; a < this.inputData.teamDepartments.length; a++) {
        for (let b = 0; b < this.teamDepartments.length; b++) {
          if (this.teamDepartments[b].id === this.inputData.teamDepartments[a].id) {
            this.teamDepartments[b].check = true;
          }
        }
      }
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
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  addDepartment() {
    // for (let a = 0; a < this.inputData.teamDepartments.length; a++) {
    //   this.inputData.teamDepartments.empty();
    // }
    this.inputData.teamDepartments.length = 0;
    for (let a = 0; a < this.teamDepartments.length; a++) {
      if (this.teamDepartments[a].check) {
        this.inputData.teamDepartments.push(this.teamDepartments[a]);
      }
    }
  }

  searchFieldChanged(): void {
    // console.log(this.search.controls.searchField.value);
    if (this.search.controls.searchField.value) {
      for (let i = 0; i < this.teamDepartments.length; i++) {
        if (!this.teamDepartments[i].name.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
          $('#' + this.teamDepartments[i].id).hide();
        }
        if (this.teamDepartments[i].name.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
          $('#' + this.teamDepartments[i].id).show();
        }
      }
    } else {
      for (let i = 0; i < this.teamDepartments.length; i++) {
        $('#' + this.teamDepartments[i].id).show();
      }
    }
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'add-member',
  templateUrl: 'AddMember.html',
  styleUrls: ['./AddMemberStyle.scss'],

})
// tslint:Disable-next-line:component-class-suffix
export class AddMember implements OnInit {
  textDirection = TextDirectionController.textDirection;
  members;
  search: FormGroup;

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
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
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
    console.log(this.search.controls.searchField.value);
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
