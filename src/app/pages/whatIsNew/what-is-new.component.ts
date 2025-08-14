import {Component, OnInit} from '@angular/core';
import {messageDTO} from '../../DTOs/chat/MessageDTO';
import {FeatureDTO} from '../../DTOs/whatIsNew/FeatureDTO';
import {MatDialogRef} from '@angular/material/dialog';
import {VersionService} from '../../services/versionService/version.service';

@Component({
  selector: 'app-what-is-new',
  templateUrl: './what-is-new.component.html',
  styleUrls: ['./what-is-new.component.scss']
})
export class WhatIsNewComponent implements OnInit {
  featuresArray: Array<FeatureDTO> = [];
  index = 0;

  constructor(public dialogRef: MatDialogRef<WhatIsNewComponent>,
              private versionService: VersionService) {
  }

  ngOnInit(): void {
    this.versionService.getVersionLogs(localStorage.getItem('currentVersion')).subscribe(res => {
      const logs = res.value['logs'];
      for (let i = 0; i < logs.length; i++) {
        this.featuresArray.push(new FeatureDTO(logs[i]['log'], logs[i]['imageUrl']));
      }
    });
  }

  next() {
    if (this.index < this.featuresArray.length) {
      this.index++;
    }
  }

  back() {
    if (this.index > 0) {
      this.index--;
    }
  }

  done() {
    console.log('DONE');
  }


}
