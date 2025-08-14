import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TeamService} from '../../../services/teamSerivce/team.service';
import {ProjectService} from '../../../services/projectService/project.service';
import {KanbanService} from '../../../services/kanbanService/kanban.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {channelDTO} from '../../../DTOs/chat/ChannelDTO';
import {ChatService} from '../../../services/chatService/chat.service';
import {DatePipe} from '@angular/common';
import {DomainName} from '../../../utilities/PathTools';
import * as $ from 'jquery';
import {TextDirectionController} from '../../../utilities/TextDirectionController';

@Component({
  selector: 'app-channel-member-list-dialog',
  templateUrl: './channel-member-list-dialog.component.html',
  styleUrls: ['./channel-member-list-dialog.component.scss']
})
export class ChannelMemberListDialogComponent implements OnInit {

  isLoading = false;
  channelList: Array<channelDTO> = [];

  domainName = DomainName;
  search: FormGroup;

  textDirection = TextDirectionController.textDirection;

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              // tslint:Disable-next-line:variable-name
              private _snackBar: MatSnackBar,
              private chatService: ChatService,
              private datePipe: DatePipe,
              public dialogRef: MatDialogRef<ChannelMemberListDialogComponent>,
              private _formBuilder: FormBuilder,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    this.getChannels();
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]],
    });
  }

  getChannels(): void {
    this.isLoading = true;
    this.chatService.getChannels().subscribe((res) => {
      this.isLoading = false;
      // this.channels = res.value;
      for (let i = 0; i < res.value.length; i++) {
        if (res.value[i].lastMessage != null) {
          res.value[i].lastMessage.sendOn = this.changeTime(
            res.value[i].lastMessage.sendOn
          );
        }
        this.channelList.push(
          new channelDTO(
            res.value[i].guid,
            res.value[i].title,
            res.value[i].profileImageGuid,
            res.value[i].channelTypeId,
            res.value[i].isMuted,
            res.value[i].isPinned,
            res.value[i].isOnline,
            res.value[i].evenOrder,
            this.changeTime(res.value[i].lastTransactionDateTime),
            res.value[i].numberOfUnreadMessages,
            res.value[i].lastMessage
          )
        );
      }
    });
  }

  changeTime(time) {
    const temp = time.toString().split('.')[0].split('T');
    const timeChanged = new Date(
      temp[0].split('-')[1] +
      '/' +
      temp[0].split('-')[2] +
      '/' +
      temp[0].split('-')[0] +
      ' ' +
      temp[1].split(':')[0] +
      ':' +
      temp[1].split(':')[1] +
      ':' +
      temp[1].split(':')[2] +
      ' UTC'
    );
    const currentDate = new Date();
    const diffDays = Math.floor(
      (Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ) -
        Date.UTC(
          timeChanged.getFullYear(),
          timeChanged.getMonth(),
          timeChanged.getDate()
        )) /
      (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) {
      return this.datePipe.transform(timeChanged, 'H:mm');
    } else if (diffDays < 7) {
      return diffDays + 'd';
    } else {
      if (Math.floor(diffDays / 7) < 52) {
        return Math.floor(diffDays / 7) + 'w';
      } else {
        return Math.floor(diffDays / 7 / 52) + 'y';
      }
    }
  }

}
