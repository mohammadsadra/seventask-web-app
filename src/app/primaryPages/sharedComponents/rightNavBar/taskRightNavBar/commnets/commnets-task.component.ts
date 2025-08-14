import {Component, HostListener, OnInit} from '@angular/core';
import {GeneralTaskDTO} from '../../../../../DTOs/kanban/GeneralTaskDTO';
import {MainWithInspectorService} from '../../../../../services/mainWithInspectorService/main-with-inspector.service';
import {DirectionService} from '../../../../../services/directionService/direction.service';
import {KanbanService} from '../../../../../services/kanbanService/kanban.service';
import {TaskCommentDTO} from '../../../../../DTOs/kanban/TaskCommentDTO';
import {DomainName} from '../../../../../utilities/PathTools';
import {TaskCommentPostDTO} from '../../../../../DTOs/kanban/TaskCommentPostDTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TextDirectionController} from '../../../../../utilities/TextDirectionController';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {CalendarService} from '../../../../../services/calendarService/calendar.service';
import * as moment from 'moment';
import {SettingsService} from '../../../../../services/settingsService/settings.service';
import {DataService} from '../../../../../services/dataService/data.service';

@Component({
  selector: 'app-commnets-task',
  templateUrl: './commnets-task.component.html',
  styleUrls: ['./commnets-task.component.scss'],
})
export class CommnetsTaskComponent implements OnInit {
  constructor(
    private mainWithInspectorService: MainWithInspectorService,
    private dataService: DataService,
    private directionService: DirectionService,
    private kanbanService: KanbanService,
    private translateService: TranslateService,
    private _snackbar: MatSnackBar
  ) {
  }

  public isEmojiPickerVisible: boolean;
  emojiPickerColor: string;
  public scrollNow = new Subject();
  columnHeight;
  domainName: string = DomainName;
  selectedTask: GeneralTaskDTO;
  selectedTaskComments: TaskCommentDTO[] = [];
  editingTask: GeneralTaskDTO;
  iconRotationDegree = 0;
  newComment = '';
  showGetCommentsLoading = true;
  presetMessage: string[];

  hubNewComment: TaskCommentDTO;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.columnHeight = event.target.innerHeight;
  }

  ngOnInit(): void {
    this.emojiPickerColor =
      SettingsService.getSettingsFromLocalStorage().themeColor;
    this.columnHeight = window.innerHeight;
    this.mainWithInspectorService.currenttask.subscribe((message) => {
      if (this.selectedTask == null || message.id !== this.selectedTask.id) {
        this.showGetCommentsLoading = true;
        this.selectedTask = message;
        this.newComment = '';
        this.getTaskComments();
      }
    });

    this.dataService.currentTaskComment.subscribe(hubCommentResponse => {
      if (!hubCommentResponse) {
        return;
      }
      if (hubCommentResponse.comment.generalTaskId === this.selectedTask.id && hubCommentResponse.isCreated) {
        this.selectedTaskComments.push(hubCommentResponse.comment);
      }
    });

    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
    });

    this.mainWithInspectorService.currentEditingTask.subscribe((message) => {
      this.editingTask = message;
    });
    this.presetMessage = ['Nice 👌', 'Well Done 👏', 'Thanks 😊', 'OK 👍'];
  }

  public addEmoji(event) {
    this.newComment = `${this.newComment}${event.emoji.native}`;
  }

  log(inp) {
    // console.log(inp);
  }

  private getTaskComments() {
    if (this.selectedTask == null) {
      return;
    }
    this.kanbanService.getComments(this.selectedTask.id).subscribe(
      async (res) => {
        this.showGetCommentsLoading = false;
        this.selectedTaskComments = res.value;
        this.selectedTaskComments.forEach((comment) => {
          comment.commentedOn = new Date(
            CalendarService.convertUtcToLocalTime(
              comment.commentedOn,
              'YYYY-MM-DDTHH:mm:ss'
            )
          );
        });
      },
      async (err) => {
        this._snackbar.open(
          await this.translateService
            .get('Snackbar.problemGettingComments')
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

  addComment() {
    if (this.newComment === '') {
      return;
    }
    const newComment = new TaskCommentPostDTO(
      this.selectedTask.id,
      this.newComment,
      []
    );
    this.newComment = '';
    this.kanbanService.addComment(newComment).subscribe((res) => {
      this.newComment = '';
      this.selectedTaskComments.push(res.value);
      // console.log(res);
    });
  }

  addPreset(Preset) {
    const newPreset = new TaskCommentPostDTO(this.selectedTask.id, Preset, []);
    this.kanbanService.addComment(newPreset).subscribe((res) => {
      this.selectedTaskComments.push(res.value);
      // console.log(res);
    });
  }

  sendWithEnter(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      this.addComment();
    } else {
    }
  }
}
