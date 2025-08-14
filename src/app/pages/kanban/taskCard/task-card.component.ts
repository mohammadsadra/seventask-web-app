import {Component, Input, OnInit, Output} from '@angular/core';
import {GeneralTaskDTO} from '../../../DTOs/kanban/GeneralTaskDTO';
import {MainWithInspectorService} from '../../../services/mainWithInspectorService/main-with-inspector.service';
import {DomainName} from '../../../utilities/PathTools';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import {KanbanService} from '../../../services/kanbanService/kanban.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ShowMessageInDialogComponent} from '../../../primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {ButtonTypeEnum} from '../../../enums/ButtonTypeEnum';
import {DialogMessageEnum} from '../../../enums/DialogMessageEnum';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../../services/dataService/data.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() item: GeneralTaskDTO;
  @Input() width = '310px';
  @Input() mode = 'card';
  @Input() cursor = 'grab';
  @Input() backgroundColor = 'white';
  @Output() needRemove = new EventEmitter();
  @Output() updateUrgency = new EventEmitter();
  selectedTask: GeneralTaskDTO;
  domainName: string = DomainName;

  constructor(private mainWithInspectorService: MainWithInspectorService,
              private kanbanService: KanbanService,
              private translateService: TranslateService,
              private dataService: DataService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.mainWithInspectorService.currenttask.subscribe((message) => {
      this.selectedTask = message;
    });
  }

  updateUrgent(task: GeneralTaskDTO, isUrgent) {
    const selectedTask: GeneralTaskDTO = {...this.selectedTask};
    this.kanbanService.updateUrgent(selectedTask.id, isUrgent).subscribe(
      async (res) => {
        // this.selectedTask = {...selectedTask};
        // if (selectedTask.id === this.selectedTask.id) {
        //   this.selectedTask.isUrgent = isUrgent;
        // }
        selectedTask.isUrgent = isUrgent;
        this.mainWithInspectorService.changeEditingTask(selectedTask);
        this.updateUrgency.emit();
        // this.mainWithInspectorService.changeMessage(selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.taskUrgancyUpdated')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      },
      async (err) => {
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.cantUpdateTaskUrgency')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      }
    );
  }

  openDeleteDialog(task: GeneralTaskDTO) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteTask,
        itemName: task.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.deleteTask(this.selectedTask);
        }
      }
    });
  }

  deleteTask(task: GeneralTaskDTO) {
    this.kanbanService.deleteTask(task.id).subscribe(
      async (res) => {
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() - 1
        );
        this.mainWithInspectorService.changeMessage(null);
        this.needRemove.emit('delete');

        // console.log(this.dropLists);
        this._snackBar.open(
          await this.translateService.get('Snackbar.taskDeleted').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      },
      async (error) => {
        this._snackBar.open(
          error.error.message,
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      }
    );
  }

  archiveTask(task: GeneralTaskDTO) {
    this.kanbanService.archiveTask(task.id).subscribe(
      async (res) => {
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() - 1
        );
        this.mainWithInspectorService.changeMessage(null);
        this.needRemove.emit('archive');
        this._snackBar.open(
          await this.translateService.get('Snackbar.taskArchived').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      },
      async (err) => {
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.cantArchiveTask')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
          }
        );
      }
    );
  }

  setColorForStatus(statusTitle: string) {
    const colors = ['rgba(66,120,223,0.1)', 'rgba(66, 223, 101, 0.1)', 'rgba(223, 138, 39, 0.1)', 'rgba(223, 28, 180, 0.1)',
      'rgba(208, 223, 28, 0.1)', 'rgba(28, 188, 223, 0.1)', 'rgba(114, 28, 223, 0.1)', 'rgba(237, 7, 90, 0.1)',
      'rgba(7, 237, 182, 0.1)', 'rgba(2, 134, 163, 0.1)'];
    const fontColors = ['rgba(66,120,223,1)', 'rgba(66, 223, 101, 1)', 'rgba(223, 138, 39, 1)', 'rgba(223, 28, 180, 1)',
      'rgba(208, 223, 28, 1)', 'rgba(28, 188, 223, 1)', 'rgba(114, 28, 223, 1)', 'rgba(237, 7, 90, 1)',
      'rgba(7, 237, 182, 1)', 'rgba(2, 134, 163, 1)'];
    const calculateScore = (str = '') => {
      return str.split('').reduce((acc, val) => {
        return acc + val.charCodeAt(0);
      }, 0);
    };
    // console.log(colors[calculateScore(statusTitle) % 8]);
    return [colors[calculateScore(statusTitle) % 10], fontColors[calculateScore(statusTitle) % 10]];
  }

  showInspector(id: string): GeneralTaskDTO {
    // let selectedTask: GeneralTaskDTO;
    if (this.selectedTask != null && this.selectedTask.guid === id) {
      this.mainWithInspectorService.changeMessage(null);
    } else {
      this.mainWithInspectorService.changeMessage(this.item);
    }
    return null;
  }

}
