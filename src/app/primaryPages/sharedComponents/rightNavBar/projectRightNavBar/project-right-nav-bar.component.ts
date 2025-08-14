import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MainWithInspectorService} from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../../../services/projectService/project.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomainName} from '../../../../utilities/PathTools';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ChatDataService} from '../../../../services/dataService/chatDataService/chat-data.service';
import {DeleteMessageVerificationDialog} from '../../../../pages/chatRoom/chat-room.component';
import {messageDTO} from '../../../../DTOs/chat/MessageDTO';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {JWTTokenService} from '../../../../services/accountService/jwttoken.service';
import {CalendarTypeEnum} from '../../../../enums/CalendarTypeEnum';
import {ColorsEnum} from '../../../../enums/ColorsEnum';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProjectChangeTeamComponent} from '../../../../pages/project/project-change-team/project-change-team.component';

@Component({
  selector: 'app-project-right-nav-bar',
  templateUrl: './project-right-nav-bar.component.html',
  styleUrls: ['./project-right-nav-bar.component.scss'],
  animations: [trigger('showHideButton', [
    state('show', style({
      opacity: 1,
    })),
    state('hide', style({
      opacity: 0,
    })),
    transition('hide => show', animate('0.1s ease-in')),
    transition('show => hide', animate('0.1s ease-out'))
  ])],
})
export class ProjectRightNavBarComponent implements OnInit {
  height = window.innerHeight - 80;
  selectedProject: ProjectDTO;

  editTitle = false;
  editTitleClicked = false;

  editDescription = false;
  editDescriptionClicked = false;

  editTeamHover = false;

  editColor = false;
  editColorClicked = false;
  selectedColor = '';

  editForm: FormGroup;
  domainName = DomainName;

  public confirmDelete: Array<string> = [];
  public myUserGUID: string;

  iconRotationDegree = TextDirectionController.iconRotationDegree;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight - 80;
  }

  constructor(private mainWithInspectorService: MainWithInspectorService,
              private projectService: ProjectService,
              private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private directionService: DirectionService,
              public translateService: TranslateService,
              private jwtTokenService: JWTTokenService) {
    this.myUserGUID = jwtTokenService.getUserId();
  }

  ngOnInit(): void {
    this.directionService.currentRotation.subscribe(message => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });

    this.mainWithInspectorService.currentProject.subscribe(message => {
      this.selectedProject = message;
    });

    this.editForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Description: new FormControl(null),
    });
  }

  public get colorsId(): typeof ColorsEnum {
    return ColorsEnum;
  }

  modifyTitle() {
    this.editTitleClicked = false;
    if (this.selectedProject.name !== this.editForm.controls.Title.value
      && this.editForm.controls.Title.value.match(/^\s*$/) === null) {
      this.projectService.updateName(this.selectedProject.id, this.editForm.controls.Title.value).subscribe(async res => {
        // console.log();
        this.selectedProject.name = this.editForm.controls.Title.value;
        // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(await this.translateService.get('Snackbar.titleChanged').toPromise(), await this.translateService.get('Buttons.ok').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
      }, async error => {
        this._snackBar.open(await this.translateService.get('Snackbar.editProjectTitleError').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(), {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          });
      });
    }
  }

  modifyColor() {
    this.editColorClicked = false;
    if (this.selectedColor !== this.selectedProject.color) {
      this.projectService.updateColor(this.selectedProject.id, this.selectedColor).subscribe(async res => {
        // console.log();
        this.selectedProject.color = this.selectedColor;
        this._snackBar.open(await this.translateService.get('Snackbar.colorChanged').toPromise(), await this.translateService.get('Buttons.ok').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
      }, async error => {
        this._snackBar.open(await this.translateService.get('Snackbar.editProjectColorError').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
      });
    }
  }

  modifyDescription() {
    this.editDescriptionClicked = false;
    if (this.selectedProject.description !== this.editForm.controls.Description.value) {
      this.projectService.updateDescription(this.selectedProject.id, this.editForm.controls.Description.value).subscribe(async res => {
        this.selectedProject.description = this.editForm.controls.Description.value;
        // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(await this.translateService.get('Snackbar.descriptionChanged').toPromise(), await this.translateService.get('Buttons.ok').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
      }, async error => {
        this._snackBar.open(await this.translateService.get('Snackbar.editProjectDescriptionError').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
      });
    }
  }

  editProjectTeam() {
    let dialogRef: MatDialogRef<ProjectChangeTeamComponent>;
    const config = new MatDialogConfig<ProjectDTO>();
    config.data = this.selectedProject;
    config.width = "40%";
    config.maxWidth = "100%";
    dialogRef = this.dialog.open(ProjectChangeTeamComponent, config);

    dialogRef.afterClosed().subscribe((data) => {
      // this.getDataFromApi();
      // this.tellFilterUpdateToChild(data.filterFormat);
    });
  }

  deleteProject() {
    this.projectService.deleteProject(this.selectedProject.id).subscribe(async res => {
      this.selectedProject = null;
      this.router.navigateByUrl('project');
      this._snackBar.open(await this.translateService.get('Snackbar.deleted').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
      });
    }, async error => {
      this._snackBar.open(await this.translateService.get('Snackbar.deleteProjectError').toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise(), {
          duration: 2000,
          panelClass: 'snack-bar-container',
          direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
        });
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteProjectVerificationDialog, {
      minWidth: '100px',
      // height: '400px',
      data: {
        dataKey: this.selectedProject,
        delete: this.confirmDelete,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.confirmDelete[0] === 'delete') {
        this.deleteProject();
        this.confirmDelete = [];
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-project-verification',
  templateUrl: 'deleteProject/delete-project.html',
  styleUrls: ['./deleteProject/delete-project-style.scss'],
})

// tslint:Disable-next-line:component-class-suffix
// tslint:disable-next-line:component-class-suffix
export class DeleteProjectVerificationDialog implements OnInit {
  projectData: ProjectDTO;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              public translateService: TranslateService) {
    this.projectData = this.inputData.dataKey;
  }

  ngOnInit(): void {
  }

  deleteProject(): void {
    this.inputData.delete.push('delete');
  }
}
