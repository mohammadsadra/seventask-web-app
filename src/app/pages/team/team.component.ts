import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {TeamService} from '../../services/teamSerivce/team.service';
import {InviteLinkHandlerService} from '../../services/inviteLinkHandlerService/invite-link-handler.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateTeamDTO} from '../../DTOs/team/CreateTeamDTO';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditTeamDTO} from '../../DTOs/team/EditTeamDTO';
import {JWTTokenService} from '../../services/accountService/jwttoken.service';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {DataService} from '../../services/dataService/data.service';
import {MainWithInspectorService} from '../../services/mainWithInspectorService/main-with-inspector.service';
import {TranslateService} from '@ngx-translate/core';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  animations: [


    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({opacity: 0}),
          stagger('150ms', animate('600ms ease-out', style({opacity: 1}))),
        ], {optional: true}),
        query(':leave', animate('170ms', style({opacity: 0})), {
          optional: true,
        }),
      ]),
    ]),

    // trigger('items', [
    //   transition(':enter', [
    //     style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
    //     animate(1000,
    //       style({ transform: 'scale(1)', opacity: 1 }))  // final
    //   ]),
    //   transition(':leave', [
    //     style({ transform: 'scale(1)', opacity: 1, height: '*' }),
    //     animate(1000,
    //       style({
    //         transform: 'scale(0.5)', opacity: 0,
    //         height: '0px', margin: '0px'
    //       }))
    //   ])
    // ])
  ],
})
export class TeamComponent implements OnInit {
  // Loading fields
  showTeamsLoading = true;
  creatTeamForm: FormGroup;
  editTeamForm: FormGroup;
  teams: Array<TeamDTO> = [];
  inviteLinkGuid;
  response;
  selectedTeam: TeamDTO = null;
  nickName;
  creatCardInputs = '';
  edit = false;
  creatBtnOff = false;
  selectedTeamToInspect: TeamDTO;



  constructor(private _formBuilder: FormBuilder,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private inviteLinkHandlerService: InviteLinkHandlerService,
              private location: Location,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private dataService: DataService,
              private jwtTokenService: JWTTokenService,
              private router: Router,
              private mainWithInspectorService: MainWithInspectorService,
              public translateService: TranslateService) {
    this.route.queryParams.subscribe(async params => {
      this.inviteLinkGuid = params['invitationCode'];
      this.response = this.inviteLinkHandlerService.validateGuid(this.inviteLinkGuid);
      if (this.response) {
        this.inviteLinkHandlerService.joinTeam(this.inviteLinkGuid).subscribe(async p => {
            this.openSnackBar(await this.translateService.get('Snackbar.youJoinedTeam').toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise());
            // this.location.replaceState('/team');
            this.router.navigate(['/team']).then(r => {
            });
          }, async error => {
            this.openSnackBar(await this.translateService.get('Snackbar.notAcceptable').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
            // this.location.replaceState('/team');
            // this.location.go('team');
            this.router.navigate(['/team']).then(r => {
            });
          }
        );
      } else if (this.response === false) {
        this.openSnackBar(await this.translateService.get('Snackbar.invalidLink').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
      }
      // this.location.replaceState('/team');
    });
    // this.nickName = jwtTokenService.getUserNickName();
  }

  ngOnInit(): void {
    this.mainWithInspectorService.changeSelectedTeam(null);
    this.mainWithInspectorService.currentTeam.subscribe(message => {
    });

    this.creatTeamForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      color: ['']
    });
    this.editTeamForm = this._formBuilder.group({
      name: [],
      description: [],
      color: []
    });
    this.getTeams();
    this.dataService.currentTeam.subscribe(team => {
      if (team != null) {
        this.teams.splice(0, 0, team);
      }
    });
    // this.editTeamForm.controls['name'].Disable();
    // this.editTeamForm.controls['description'].Disable();
  }

  openTeamOverviewPage(id) {
    this.router.navigateByUrl('team/teamOverview/' + id);
    this.showInspector(id);
    // [routerLink]="['projectOverview', project.id]"
  }

  public showInspector(id: number): TeamDTO {
    let selectedTeam: TeamDTO;
    for (const team of this.teams) {
      if (team.id === id) {
        selectedTeam = team;
        // console.log(selectedTask);
        this.mainWithInspectorService.changeSelectedTeam(team);
        console.log(team);
        return selectedTeam;
      }
    }
    return null;
    // console.log(selectedTask);
  }

  creatTeam(): void {
    const creatTeamData = new CreateTeamDTO(
      this.creatTeamForm.controls.name.value,
      this.creatTeamForm.controls.description.value,
      this.creatTeamForm.controls.color.value,
      [],
      [],
      []
    );
    this.teamService.createTeam(creatTeamData).subscribe(async res => {
      this.openSnackBar(await this.translateService.get('Snackbar.teamCreated').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
      this.teams.push(res.value);
      this.creatTeamForm.reset();
    }, async error => this.openSnackBar(await this.translateService.get('Snackbar.tryAgain').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise()));
  }

  getTeams(): void {
    this.teamService.getAllTeam().subscribe(res => {
      this.teams = res;
      this.showTeamsLoading = false;
    });
  }

  openDialog(team) {
    this.selectedTeam = team;
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      minWidth: '600px',
      // height: '400px',
      data: {
        dataKey: this.selectedTeam
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  editTeam(team) {
    this.edit = true;
    this.creatBtnOff = true;
    this.creatTeamForm.reset();
    this.creatCardInputs = 'none';
    this.creatTeamForm.controls['name'].disable();
    this.creatTeamForm.controls['description'].disable();

    document.getElementById('color' + team.id).style.pointerEvents = '';
    document.getElementById('name' + team.id).removeAttribute('disabled');
    document.getElementById('description' + team.id).removeAttribute('disabled');
    document.getElementById('saveBtn' + team.id).style.visibility = 'visible';
    document.getElementById('cancelBtn' + team.id).style.visibility = 'visible';
    document.getElementById('editBtn' + team.id).style.visibility = 'hidden';
    document.getElementById('inviteBtn' + team.id).style.visibility = 'hidden';
    document.getElementById('deleteBtn' + team.id).style.display = 'none';
  }

  saveChanges(team) {
    let name;
    let color;
    let description;
    if (this.editTeamForm.controls.name.value) {
      name = this.editTeamForm.controls.name.value;
      team.name = name;
    } else {
      name = team.name;
    }
    if (this.editTeamForm.controls.description.value) {
      description = this.editTeamForm.controls.description.value;
      team.description = description;
    } else {
      description = team.description;
    }
    if (this.editTeamForm.controls.color.value) {
      color = this.editTeamForm.controls.color.value;
      team.color = color;
    } else {
      color = team.color;
    }
    const editTeamDTO = new EditTeamDTO(
      team.id,
      name,
      description,
      color
    );
  }

  cancelChanges(team) {
    this.edit = false;
    this.creatBtnOff = false;
    this.editTeamForm.reset();
    this.creatCardInputs = '';
    this.creatTeamForm.controls['name'].enable();
    this.creatTeamForm.controls['description'].enable();

    document.getElementById('color' + team.id).style.pointerEvents = 'none';
    document.getElementById('name' + team.id).setAttribute('disabled', 'true');
    document.getElementById('description' + team.id).setAttribute('disabled', 'true');
    document.getElementById('saveBtn' + team.id).style.visibility = 'hidden';
    document.getElementById('cancelBtn' + team.id).style.visibility = 'hidden';
    document.getElementById('editBtn' + team.id).style.visibility = 'visible';
    document.getElementById('inviteBtn' + team.id).style.visibility = 'visible';
    document.getElementById('deleteBtn' + team.id).style.display = '';
  }

  creatTeamColor(e) {
    this.creatTeamForm.controls.color.setValue(e.color.hex.split('#')[1]);
  }

  editTeamColor(e) {
    this.editTeamForm.controls.color.setValue(e.color.hex.split('#')[1]);
  }

  openDeleteDialog(team) {
    const dialogRef = this.dialog.open(DeleteVerification, {
      minWidth: '100px',
      // height: '400px',
      data: {
        dataKey: team
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}


@Component({
  // tslint:Disable-next-line:component-selector
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content-example-dialog',
  templateUrl: 'invite-link-dialog-page.html',
})

// tslint:Disable-next-line:component-class-suffix
// tslint:disable-next-line:component-class-suffix
export class DialogContentExampleDialog implements OnInit {
  teamData;
  allLinks;
  thisTeamLinks = [];
  newLinks = [];
  isNewLinkAvailable = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private inviteLinkHandlerService: InviteLinkHandlerService,
              private _snackBar: MatSnackBar,
              public translateService: TranslateService) {
    this.teamData = this.data.dataKey;
  }

  ngOnInit(): void {
    this.getLinks();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  creatNewLink(teamID) {
    this.isNewLinkAvailable = true;
    this.inviteLinkHandlerService.creatTeamInviteLink(teamID).subscribe(async res => {
      this.newLinks.push(res.value);
      this.openSnackBar(await this.translateService.get('Snackbar.linkCreated').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
    }, async error => this.openSnackBar(await this.translateService.get('Snackbar.tryAgain').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise()));
  }

  getLinks() {
    this.inviteLinkHandlerService.getAllTeamInviteLinks().subscribe(res => {
      if (res && res.length !== 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].teamName === this.teamData.name) {
            this.thisTeamLinks.push(res[i]);
          }
        }
      }
    });
  }

  revokeTeamInviteLink(link, arrType) {
    this.inviteLinkHandlerService.revokeTeamInviteLink(link.id).subscribe(async res => {
      if (arrType === 0) {
        const index = this.thisTeamLinks.indexOf(link, 0);
        if (index > -1) {
          this.newLinks.splice(index, 1);
        }
      } else if (arrType === 1) {
        const index = this.newLinks.indexOf(link, 0);
        if (index > -1) {
          this.newLinks.splice(index, 1);
        }
      }
      this.openSnackBar(await this.translateService.get('Snackbar.deleted').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
    }, async error => this.openSnackBar(await this.translateService.get('Snackbar.tryAgain').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise()));

  }

}

@Component({
  // tslint:Disable-next-line:component-selector
  // tslint:disable-next-line:component-selector
  selector: 'delete-verification',
  templateUrl: 'DeleteVerification.html',
  styleUrls: ['./DeleteVerificationStyle.scss'],
})

// tslint:Disable-next-line:component-class-suffix
// tslint:disable-next-line:component-class-suffix
export class DeleteVerification implements OnInit {
  teamData;


  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              public translateService: TranslateService) {
    this.teamData = this.inputData.dataKey;
  }

  ngOnInit(): void {
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  deleteTeam() {
    this.teamService.deleteTeam(this.teamData.id).subscribe(async res => {
      this.openSnackBar(await this.translateService.get('Snackbar.deleted').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
    }, async error => this.openSnackBar(await this.translateService.get('Snackbar.tryAgain').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise()));
  }
}
