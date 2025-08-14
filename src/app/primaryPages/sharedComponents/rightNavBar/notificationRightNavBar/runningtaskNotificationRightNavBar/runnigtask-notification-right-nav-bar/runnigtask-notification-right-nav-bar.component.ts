import { Component, OnInit, Input } from '@angular/core';
import { NotificRunningTaskService } from '../../../../../../services/notificationRunningTaskService/notific-running-task.service';
import { TranslateService } from '@ngx-translate/core';
import { interval } from 'rxjs';
import { TimeService } from '../../../../../../services/timeService/time.service';
import { DataService } from '../../../../../../services/dataService/data.service';
import { GeneralTaskDTO } from '../../../../../../DTOs/kanban/GeneralTaskDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextDirectionController } from '../../../../../../utilities/TextDirectionController';
import { MainWithInspectorService } from '../../../../../../services/mainWithInspectorService/main-with-inspector.service';
import { GetRunningTasksResponseModel } from '../../../../../../DTOs/responseModel/GetRunningTasksResponseModel';

@Component({
  selector: 'app-runnigtask-notification-right-nav-bar',
  templateUrl: './runnigtask-notification-right-nav-bar.component.html',
  styleUrls: ['./runnigtask-notification-right-nav-bar.component.scss'],
})
export class RunnigtaskNotificationRightNavBarComponent implements OnInit {
  showGetRunningTasksLoading = true;
  runningTasks: Array<any> = [];
  timerShow = 0;
  runningTaskNoData = false;
  editingRunningTask: GeneralTaskDTO = null;
  editingRunningTaskIsStopping: boolean;
  addingRunningTask: GeneralTaskDTO = null;

  constructor(
    private notificRunningTaskService: NotificRunningTaskService,
    public translateService: TranslateService,
    private timeService: TimeService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private mainWithInspectorService: MainWithInspectorService
  ) {}

  ngOnInit(): void {
    this.mainWithInspectorService.currentEditingTask.subscribe((message) => {
      if (message == null) {
        return;
      }
      this.editingRunningTask = message;
    });

    this.mainWithInspectorService.currentRunningTaskIsStoppingSource.subscribe(
      (message) => {
        if (message == null) {
          return;
        }
        this.editingRunningTaskIsStopping = message;
      }
    );

    this.mainWithInspectorService.currentAddingRunningTask.subscribe(
      (message) => {
        if (message == null) {
          return;
        }
        this.addingRunningTask = message;
        this.runningTasks.push(message);
      }
    );

    this.notificRunningTaskService.getNotificRunningTask().subscribe((data) => {
      // console.log(data);
      if (data !== null) {
        this.runningTasks = data;
        if (data.length > 0) {
          this.runningTaskNoData = false;
          interval(1000).subscribe(() => {
            this.timerShow++;
          });
        } else {
          this.runningTaskNoData = true;
        }
        this.showGetRunningTasksLoading = false;
      }
    });

    this.dataService.currentStopTime.subscribe((runTask) => {
      this.runningTasks.forEach((item) => {
        if (item.id === runTask) {
          this.runningTasks.splice(this.runningTasks.indexOf(item), 1);
        }
      });
      this.dataService.currentStopTime.subscribe(null);
      if (this.runningTasks.length === 0) {
        this.runningTaskNoData = true;
      }
    });

    this.dataService.currentStartTime.subscribe((runTaskStart) => {
      if (
        runTaskStart !== undefined ||
        (runTaskStart !== null && this.runningTasks.length > 0)
      ) {
        this.runningTaskNoData = false;
        this.runningTasks.forEach((startItem, index) => {
          if (runTaskStart.id === startItem.id) {
            this.runningTasks.splice(index, 1, runTaskStart);
          }
        });
      }
    });

    this.dataService.currentPausedTime.subscribe((runTaskPause) => {
      this.runningTasks.forEach((PausedItem, index) => {
        if (runTaskPause === PausedItem.id) {
          this.runningTasks[index].isPaused = true;
        }
      });
    });
  }

  // ********* Functions */
  pausedTimeTracker(runtaskpause) {
    this.runningTasks.forEach((rtItem, index) => {
      if (rtItem.id === runtaskpause.id) {
        this.runningTasks[index].isPaused = true;
        this.timeService.pause(runtaskpause.id).subscribe();
        this.mainWithInspectorService.changeRunningEditingTask(rtItem);
      }
    });
  }

  startTimeTracker(runtaskstart) {
    this.runningTasks.forEach((rtItem, index) => {
      if (rtItem.id === runtaskstart.id) {
        this.runningTasks[index].isPaused = false;
        this.timeService.start(runtaskstart.id).subscribe();
        this.mainWithInspectorService.changeRunningEditingTask(rtItem);
      }
    });
  }

  stopTimeTracker(task: GeneralTaskDTO) {
    this.timeService.stop(task.id).subscribe(
      async (res) => {
        this.mainWithInspectorService.changeEditingRunningTaskIsStopping(true);
        this.mainWithInspectorService.changeRunningEditingTask(task);
        this.runningTasks = this.runningTasks.filter(
          (t) => t.taskId !== task.id
        );
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.timetrackStopped')
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
          await this.translateService.get('Snackbar.stopTimeTrackError').toPromise(),
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
