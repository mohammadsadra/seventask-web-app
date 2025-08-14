import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChatDataService} from '../../../services/dataService/chatDataService/chat-data.service';
import {DataService} from '../../../services/dataService/data.service';
import {TranslateService} from '@ngx-translate/core';
import {ButtonTypeEnum} from '../../../enums/ButtonTypeEnum';

@Component({
  selector: 'app-show-message-in-dialog',
  templateUrl: './show-message-in-dialog.component.html',
  styleUrls: ['./show-message-in-dialog.component.scss']
})

export class ShowMessageInDialogComponent implements OnInit {

  messageText = '';
  itemName = null;
  buttonNumbers = 1;
  numbers = [];
  buttonText = [ButtonTypeEnum.ok];

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any) {

    if (this.inputData.buttonNumbers) {
      this.buttonNumbers = this.inputData.buttonNumbers;
    }
    // @ts-ignore
    this.numbers = Array(this.buttonNumbers).fill().map((x, i) => i);
    if (this.inputData.messageText) {
      this.messageText = this.inputData.messageText;
    }
    if (this.inputData.itemName) {
      this.itemName = this.inputData.itemName;
    }
    if (this.inputData.buttonText) {
      this.buttonText = this.inputData.buttonText;
    }
  }

  ngOnInit(): void {
  }

  chooseColor(type) {
    if (ButtonTypeEnum.ok === type) {
      return '#7AC31E';
    } else if (ButtonTypeEnum.cancel === type) {
      return '#1EC1C3';
    } else if (ButtonTypeEnum.remove === type) {
      return '#f86f8c';
    } else if (ButtonTypeEnum.delete === type) {
      return '#f86f8c';
    } else if (ButtonTypeEnum.discard === type) {
      return '#f86f8c';
    } else if (ButtonTypeEnum.signOut === type) {
      return '#f86f8c';
    } else if (ButtonTypeEnum.clickToChoosePhoto === type) {
      return '#1EC1C3';
    } else if (ButtonTypeEnum.enjoySevenTask === type) {
      return '#1EC1C3';
    } else if (ButtonTypeEnum.gotIt === type) {
      return '#7AC31E';
    } else if (ButtonTypeEnum.upload === type) {
      return '#7AC31E';
    } else if (ButtonTypeEnum.archive === type) {
      return '#7AC31E';
    }
    return '#7436f3';
  }

}
