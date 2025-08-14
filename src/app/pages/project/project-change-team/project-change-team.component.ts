import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectDTO} from '../../../DTOs/project/Project';
import {TeamService} from '../../../services/teamSerivce/team.service';
import {TeamDTO} from '../../../DTOs/team/Team.DTO';
import {DepartmentDTO} from '../../../DTOs/department/DepartmentDTO';
import {ProjectService} from '../../../services/projectService/project.service';

@Component({
  selector: 'app-project-change-team',
  templateUrl: './project-change-team.component.html',
  styleUrls: ['./project-change-team.component.scss']
})
export class ProjectChangeTeamComponent implements OnInit {
  userTeams: TeamDTO[] = [];
  teamDepartments: any[] = [];
  gettingDataFromApi = true;
  selectedTeam: TeamDTO;
  selectedDepartments: number[] = [];
  teamIsFinal = false;
  departmentsIsFinal = false;
  showReview = false;
  checkedAllDepartments = false;
  lockAllDepartmentsCheckBox = true;

  constructor(@Inject(MAT_DIALOG_DATA) public model: ProjectDTO,
              private _dialogRef: MatDialogRef<ProjectChangeTeamComponent>,
              private _teamService: TeamService,
              private _projectService: ProjectService) {
  }

  ngOnInit(): void {
    this._teamService.getAllTeam().subscribe((data) => {
      this.gettingDataFromApi = false;
      this.userTeams = data;
      if (this.model.teamId) {
        this.selectedTeam = this.userTeams.find(x => x.id == this.model.teamId);
      }
    });
  }

  selectTeam(team: TeamDTO) {
    this.selectedTeam = team;
  }

  selectDepartment(dep: DepartmentDTO) {
    let itemIndex = this.selectedDepartments.indexOf(dep.id);
    if (itemIndex > -1) {
      this.selectedDepartments.splice(itemIndex, 1);
    } else {
      this.selectedDepartments.push(dep.id);
    }
  }

  nextStep() {
    if (!this.teamIsFinal) {
      this.teamIsFinal = true;
      this.gettingDataFromApi = true;
      this._teamService.getDepartmentByTeamId(this.selectedTeam.id).subscribe((data) => {
        this.checkedAllDepartments = data.value.length == 0;
        this.lockAllDepartmentsCheckBox = data.value.length == 0;
        this.gettingDataFromApi = false;
        this.teamDepartments = data.value;
      });
    } else if (!this.departmentsIsFinal) {
      this.departmentsIsFinal = true;
      this._projectService
        .updateTeamAndDepartments(this.model.id, this.selectedTeam.id, this.selectedDepartments)
        .subscribe((data) => {
          this._dialogRef.close();
          location.reload();
        });
    }
  }

  prevStep() {
    if (this.departmentsIsFinal) {
      this.departmentsIsFinal = false;
    } else if (this.teamIsFinal) {
      this.teamIsFinal = false;
    }
  }

}
