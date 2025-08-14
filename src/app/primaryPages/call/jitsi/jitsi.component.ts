import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {JWTTokenService} from '../../../services/accountService/jwttoken.service';
import {DomainName} from '../../../utilities/PathTools';
import * as uuid from 'uuid';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi',
  templateUrl: './jitsi.component.html',
  styleUrls: ['./jitsi.component.scss']
})
export class JitsiComponent implements OnInit, AfterViewInit {

  domainName: string = DomainName;
  domain = 'meet.jit.si'; // For self-hosted use your domain
  // domain = 'meet.seventask.com'; // For self-hosted use your domain
  room: any;
  options: any;
  joinOptions: any;
  api: any;
  user: any;

  // For Custom Controls
  isAudioMuted = true;
  isVideoMuted = true;

  // For joining existing meeting
  meetLink = '';

  meetName: string;

  disabled = false;

  constructor(private router: Router, private jwtTokenService: JWTTokenService) {

  }

  ngOnInit(): void {
    this.room = 'SevenTask'; // Set your room name
    this.user = {
      name: this.jwtTokenService.getCurrentUser().nickName,
      id: this.jwtTokenService.getCurrentUser().userId,
      avatar: this.domainName + '/en-US/File/get?id=' + this.jwtTokenService.getCurrentUser().profileImageGuid + '&quality=100'
    };
  }

  ngAfterViewInit(): void {
    this.options = {
      roomName: this.room,
      width: '100%',
      height: '100%',
      configOverwrite: {startWithAudioMuted: this.isAudioMuted, startWithVideoMuted: this.isVideoMuted},
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_POWERED_BY: false,
        SHOW_CHROME_EXTENSION_BANNER: false
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name,
        avatar: this.user.avatar,
      },
      videoQuality: '1080p',
    };
  }

  createMeeting() {
    if (!this.meetName || this.meetName.toLowerCase().trim() === '') {
      return;
    }
    console.log('createMeeting', this.meetName);
    this.options.roomName = this.meetName.includes('meet.jit.si')  ? this.meetName.split('meet.jit.si/')[1] : this.room + '-' + this.meetName + '-' + uuid.v4();
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    this.disabled = true;
    this.meetName = '';
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
      conferenceTerminated: this.handleConferenceTerminated,
    });
  }

  // joinExistingMeeting() {
  //   // this.options.meetLink = 'https://meet.jit.si/SevenTask-Meeting-aaa-bbb-ccc';
  //   this.options.meetLink = this.meetLink;
  //   this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  //   this.meetLink = '';
  //   this.api.addEventListeners({
  //     readyToClose: this.handleClose,
  //     participantLeft: this.handleParticipantLeft,
  //     participantJoined: this.handleParticipantJoined,
  //     videoConferenceJoined: this.handleVideoConferenceJoined,
  //     videoConferenceLeft: this.handleVideoConferenceLeft,
  //     audioMuteStatusChanged: this.handleMuteStatus,
  //     videoMuteStatusChanged: this.handleVideoStatus,
  //     conferenceTerminated: this.handleConferenceTerminated,
  //   });
  // }

  handleClose() {
    this.api?.dispose();
    this.disabled = false;
    document.querySelector('#jitsi-iframe').innerHTML = '';
    console.log('handleClose');
  }

  async handleParticipantLeft(participant) {
    console.log('handleParticipantLeft', participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  async handleParticipantJoined(participant) {
    // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    console.log('handleParticipantJoined', participant);
    const data = await this.getParticipants();
  }

  async handleVideoConferenceJoined(participant) {
    // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    console.log('handleVideoConferenceJoined', participant);
    const data = await this.getParticipants();
  }

  handleConferenceTerminated() {
    console.log('handleConferenceTerminated');
    this.api.dispose();
  }

  handleVideoConferenceLeft = () => {
    this.api.dispose();
    this.disabled = false;
    document.querySelector('#jitsi-iframe').innerHTML = '';
    console.log('handleVideoConferenceLeft');
    // this.router.navigate(['/thank-you']);
  }

  handleMuteStatus(audio) {
    console.log('handleMuteStatus', audio); // { muted: true }
  }

  handleVideoStatus(video) {
    console.log('handleVideoStatus', video); // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  executeCommand(command: string) {
    this.api.executeCommand(command);
    if (command === 'hangup') {
      // this.router.navigate(['/thank-you']);
      this.api = new JitsiMeetExternalAPI(this.domain, this.options);
      return;
    }

    if (command === 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command === 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }

}
