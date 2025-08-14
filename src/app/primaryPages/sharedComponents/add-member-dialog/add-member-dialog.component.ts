import {Component, Inject, OnInit} from '@angular/core';
import {AddMemberDialogTypeEnum} from '../../../enums/AddMemberDialogTypeEnum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TeamService} from '../../../services/teamSerivce/team.service';
import {AddMember} from '../header/projectHeader/project-header.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as $ from 'jquery';
import {UserDTO} from '../../../DTOs/user/UserDTO';
import {ProjectService} from '../../../services/projectService/project.service';
import {KanbanService} from '../../../services/kanbanService/kanban.service';
import {UserSearchPipe} from '../../../pipes/user-search.pipe';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import { Router } from '@angular/router';
import { TeamPlanInfoDTO } from 'src/app/DTOs/team/TeamPlanInfoDTO';
import { JWTTokenService } from 'src/app/services/accountService/jwttoken.service';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({opacity: 0}),
            stagger('200ms', animate('600ms ease-out', style({opacity: 1}))),
          ],
          {optional: true}
        ),
        query(':leave', animate('170ms', style({opacity: 0})), {
          optional: true,
        }),
      ]),
    ])
  ],
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent implements OnInit {

  type = '';
  activeTab = 'AddMember';
  memberOfTeam: Array<UserDTO> = [];
  memberList: Array<UserDTO> = [];
  finalMemberList: Array<UserDTO> = [];
  mailList = [];
  capacity = 10;

  search: FormGroup;
  mail: FormGroup;
  textDirection = TextDirectionController.textDirection;
  upgradeTeamRef;

  isLoading = false;
  finishedGettingTeamInfo = false;
  shouldUpgrade = false;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private jwtTokenService: JWTTokenService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private teamService: TeamService,
              private projectService: ProjectService,
              private kanbanService: KanbanService,
              public dialogRef: MatDialogRef<AddMemberDialogComponent>,
              private _formBuilder: FormBuilder,
              public translateService: TranslateService) {
    this.type = this.inputData.type;
    this.memberOfTeam = this.inputData.memberList;
    if (this.inputData.teamId !== undefined && this.type === AddMemberDialogTypeEnum.addMemberToTeam) {
      this.teamService.getTeamPlanAndResourcesUsed(Number(this.inputData.teamId)).subscribe(res => {
        const teamPlanInfo = new TeamPlanInfoDTO(res);
        this.capacity = teamPlanInfo.users - teamPlanInfo.usedUsers;
        if (this.capacity <= 0) {
          this.shouldUpgrade = true;
        }
        this.finishedGettingTeamInfo = true;
      });
    } else {
      this.finishedGettingTeamInfo = true;
    }
    if (this.type === AddMemberDialogTypeEnum.addMemberToTeam) {
      this.isLoading = true;
      this.teamService.getUsersCanBeAddedToTeam().subscribe(res => {
        this.memberList = res;
        for (let a = 0; a < this.memberOfTeam.length; a++) {
          for (let b = 0; b < this.memberList.length; b++) {
            if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
              this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
              // console.log(this.memberList);
              break;
            }
          }
        }
        this.isLoading = false;
      });
    }
    else if (this.type === AddMemberDialogTypeEnum.addMemberToDepartment) {
      if (!inputData.newTeam) {
        this.isLoading = true;
        this.teamService.getTeammates(inputData.teamID).subscribe(res => {
          this.memberList = res.value;
          for (let a = 0; a < this.memberOfTeam.length; a++) {
            for (let b = 0; b < this.memberList.length; b++) {
              if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
                this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
                // console.log(this.memberList);
                break;
              }
            }
          }
          this.isLoading = false;
        });
      } else {
        this.isLoading = true;
        this.projectService.getUsersCanBeAddedToProjectForNewProjectPage().subscribe(res => {
          this.memberList = res.value;
          for (let a = 0; a < this.memberOfTeam.length; a++) {
            for (let b = 0; b < this.memberList.length; b++) {
              if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
                this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
                // console.log(this.memberList);
                break;
              }
            }
          }
          this.isLoading = false;
        });
      }
    }
    else if (this.type === AddMemberDialogTypeEnum.addMemberToTask) {
      this.isLoading = true;
      this.kanbanService
        .getUsersCanBeAssigned(this.inputData.teamId, this.inputData.projectId)
        .subscribe((res) => {
          this.memberList = res.value;
          for (let a = 0; a < this.memberOfTeam.length; a++) {
            for (let b = 0; b < this.memberList.length; b++) {
              if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
                this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
                break;
              }
            }
          }
          this.isLoading = false;
        });
    }
    else if (this.type === AddMemberDialogTypeEnum.addMemberToProject) {
      this.isLoading = true;
      this.projectService.getUsersCanBeAddedToProjectForNewProjectPage().subscribe(res => {
        this.memberList = res.value;
        for (let a = 0; a < this.memberOfTeam.length; a++) {
          for (let b = 0; b < this.memberList.length; b++) {
            if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
              this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
              // console.log(this.memberList);
              break;
            }
          }
        }
        this.isLoading = false;
      });
    }
    else if (this.type === AddMemberDialogTypeEnum.inviteMemberToEvent) {
      this.isLoading = true;
      this.mailList = this.inputData.mailList;
      this.teamService.getUsersCanBeAddedToTeam().subscribe(res => {
        this.memberList = res;
        for (let a = 0; a < this.memberOfTeam.length; a++) {
          for (let b = 0; b < this.memberList.length; b++) {
            if (this.memberList[b].userId === this.memberOfTeam[a].userId) {
              this.memberList.splice(this.memberList.indexOf(this.memberList[b]), 1);
              // console.log(this.memberList);
              break;
            }
          }
        }
        this.isLoading = false;
      });
    }
    else if (this.type === AddMemberDialogTypeEnum.addMemberToReminder) {
      this.isLoading = true;
      if (this.inputData.teamId !== undefined && this.inputData.teamId !== null) {
        this.teamService.getTeammates(this.inputData.teamId).subscribe(res => {
          res.value.forEach(user => this.memberList.push(user));
          this.isLoading = false;
        });
      } else {
        this.memberList.push(this.jwtTokenService.getCurrentUser());
        this.isLoading = false;
      }
    }
  }

  ngOnInit(): void {
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]]
    });
    this.mail = this._formBuilder.group({
      newMail: ['', [Validators.required, Validators.email]]
    });
  }

  // searchFieldChanged(): void {
  //   if (this.search.controls.searchField.value) {
  //     for (let i = 0; i < this.memberList.length; i++) {
  //       if (!this.memberList[i].nickName.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
  //         $('#' + this.memberList[i].userId).hide();
  //       }
  //       if (this.memberList[i].nickName.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
  //         $('#' + this.memberList[i].userId).show();
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < this.memberList.length; i++) {
  //       $('#' + this.memberList[i].userId).show();
  //     }
  //   }
  // }

  isLegalToAdd(membersToAdd: number): boolean {
    return this.finalMemberList.length + this.mailList.length + membersToAdd <= this.capacity;
  }

  async openUpgradePlanSnackbar() {
    this.upgradeTeamRef = this._snackBar.open(await this.translateService.get('Snackbar.upgradeYourPlan').toPromise(),
    await this.translateService.get('Buttons.gotIt').toPromise(),
    {
      duration: 4000,
      panelClass: 'snack-bar-container',
      direction:
        TextDirectionController.getTextDirection() === 'ltr'
          ? 'ltr'
          : 'rtl',
    });
  }

  onChange(value: any) {
    if (this.finalMemberList.includes(value)) {
      this.shouldUpgrade = false;
      this.finalMemberList.splice(this.finalMemberList.indexOf(value), 1);
      return false;
    }
    if (this.type === AddMemberDialogTypeEnum.addMemberToTeam && !this.isLegalToAdd(1)) {
      this.shouldUpgrade = true;
      if (this.inputData.isCreating) {
        this.shouldUpgrade = false;
      }
      this.openUpgradePlanSnackbar();
      return false;
    } else {
      this.shouldUpgrade = false;
      this.finalMemberList.push(value);
      return true;
    }
  }

   printLen() {
    // console.log(this.memberList);
  }

  addMail() {
    if (this.type === AddMemberDialogTypeEnum.addMemberToTeam && !this.isLegalToAdd(1)) {
      this.shouldUpgrade = true;
      if (this.inputData.isCreating) {
        this.shouldUpgrade = false;
      }
      this.openUpgradePlanSnackbar();
      return false;
    }
    this.shouldUpgrade = false;
    this.mailList.push(this.mail.controls.newMail.value);
    this.mail.reset();
    return true;
  }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  done() {
    if (this.type != 'inviteMemberToEvent') {
    this.inputData.mailList.length = 0;
    if (this.mailList.length > 0) {
      for (let a = 0; a < this.mailList.length; a++) {
        this.inputData.mailList.push(this.mailList[a]);
      }
    }
  }
  }
  async goPro() {
    if (this.inputData.isCreator) {
      this.dialogRef.close();
      this.router.navigate(['/payment/', this.inputData.teamId]);
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
}
