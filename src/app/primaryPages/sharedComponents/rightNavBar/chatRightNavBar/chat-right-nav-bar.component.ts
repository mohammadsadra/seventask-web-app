import {Component, HostListener, OnInit} from '@angular/core';
import {ChatDataService} from '../../../../services/dataService/chatDataService/chat-data.service';
import {channelDTO} from '../../../../DTOs/chat/ChannelDTO';
import {DomainName} from '../../../../utilities/PathTools';
import {UserDTO} from '../../../../DTOs/user/UserDTO';
import {ChatService} from '../../../../services/chatService/chat.service';
import {messageDTO} from '../../../../DTOs/chat/MessageDTO';

@Component({
  selector: 'app-chat-right-nav-bar',
  templateUrl: './chat-right-nav-bar.component.html',
  styleUrls: ['./chat-right-nav-bar.component.scss']
})
export class ChatRightNavBarComponent implements OnInit {

  height = window.innerHeight;
  activeChannel: channelDTO;
  domainName = DomainName;
  members: Array<UserDTO>;
  fileList: Array<messageDTO> = [];

  showPreview = false;
  previewAddress = '';

  activeTab = 'general';


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight - 80;
  }

  constructor(private chatDataService: ChatDataService,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.chatDataService.currentActiveChannel.subscribe(activeChannel => {
      if (activeChannel !== null) {
        this.activeChannel = activeChannel;
        if (activeChannel.channelTypeId !== 1) {
          this.chatService.getChannelMembers(this.activeChannel.guid, this.activeChannel.channelTypeId).subscribe(res => {
            this.members = res.value;
          });
        }
        this.chatService.getFiles(this.activeChannel.guid, this.activeChannel.channelTypeId).subscribe(res => {
          this.fileList = res.value;
        });
      }
    });
  }

  detectFileType(fileName: string) {
    const type = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    if (type === 'zip' || type === 'rar' || type === '7z') {
      return 'archive';
    }
    if (type !== 'css' && type !== 'pdf' && type !== 'svg' && type !== 'html' && type !== 'js') {
      return 'other';
    }
    return fileName.split('.')[fileName.split('.').length - 1];
  }

  downloadMyFile(ref, fileName) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', ref);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  previewImage(previewAddress) {
    this.previewAddress = previewAddress;
    this.showPreview = true;
  }

}
