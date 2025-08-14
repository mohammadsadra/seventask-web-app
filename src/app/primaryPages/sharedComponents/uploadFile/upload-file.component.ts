import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileService} from './fileService/file.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import * as $ from 'jquery';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  filesToUpload: Array<any> = [];
  @Input() upload_button_text: string;
  @Input() file_input_placeholder: string;
  @Input() label_text: string;
  @Input() auto_upload_File: boolean;
  @Input() allowed_extension = 'image/*, audio/*, video/*, .doc, .pdf, .docx, .pptx, .xlsx, .zip, .rar';
  @Input() multiple: boolean;
  @Input() uploadButtonDisplay: string;
  @Input() inputButtonDisplay: string;
  @Input() max_file_size = 104_857_600; // byte - 2gigabyte 2_147_483_648
  @Input() componentId = 'file';
  @Input() mode = 'show-box';

  @Output() filesInformation = new EventEmitter();
  @Output() isDrag = new EventEmitter();

  @Output() progressEvent = new EventEmitter();
  @Output() fileLengthEvent = new EventEmitter();

  @ViewChild('fileUploader') private fileUploader: ElementRef;
  @ViewChild('fileDropRef') private fileDropRef: ElementRef;
  @ViewChild('fileDropRefHiddenBox') private fileDropRefHiddenBox: ElementRef;
  @ViewChild('fileDropRefHidden') private fileDropRefHidden: ElementRef;
  progress = 0;
  fileLen = 0;

  constructor(private fileService: FileService, private _snackBar: MatSnackBar, public translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  async handleFileInput(files: FileList) {
    // console.log('handleFileInputRec');
    for (let a = 0; a < files.length; a++) {
      if (files[a].size > this.max_file_size) {
        this.openSnackBar(files[a].name +
          await this.translateService.get('Snackbar.tooLargeForUpload').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise());
      } else {
        this.filesToUpload.push(files[a]);
      }
    }

    if (this.filesToUpload.length > 0 && this.auto_upload_File === true) {
      this.uploadFileToActivity();
      this.uploadButtonDisplay = 'none';
    }
  }

  isDragFunction(event) {
    this.isDrag.emit(event);
  }

  uploadFileToActivity() {
    this.fileLen = this.filesToUpload.length;
    this.fileLengthEvent.emit(this.fileLen);
    this.fileService.postFile(this.filesToUpload).subscribe(data => {
      this.progress = 0;
      //
      //
      // console.log('simple');
      // console.log(data);
      if (data.type === HttpEventType.UploadProgress) {
        // console.log(Math.round(100 * data.loaded / data.total));
        this.progress = Math.round(100 * data.loaded / data.total);
        this.progressEvent.emit(this.progress);
      } else if (data.type === HttpEventType.Response) {
        // console.log('hi');

        if (data.body.value.unsuccessfulFileUpload.length > 0) {
          for (let i = 0; i < data.body.value.unsuccessfulFileUpload.length; i++) {
            // console.log(data.body.value.unsuccessfulFileUpload[i] + ' :' + data.body.errors[i]);
            setTimeout(async () => {
              this.openSnackBar(data.body.value.unsuccessfulFileUpload[i] + ' :' + data.body.errors[i],
                await this.translateService.get('Buttons.gotIt').toPromise());
            }, 3100);
            // this.openSnackBar(data.value.unsuccessfulFileUpload[i] + ' :' + data.errors[i], 'Got it');
          }
        }
        this.filesToUpload = [];
        this.fileLen = 0;
        this.fileLengthEvent.emit(this.fileLen);

        this.fileUploader.nativeElement.value = '';
        if (this.mode === 'show-box') {
          this.fileDropRef.nativeElement.value = '';
        } else if (this.mode === 'hidden-box') {
          this.fileDropRefHiddenBox.nativeElement.value = '';
        } else {
          this.fileDropRefHidden.nativeElement.value = '';
        }
        this.filesInformation.emit(data.body);
        // do something, if upload success
      }
    }, async error => {
      console.log(error);
      this.openSnackBar(await this.translateService.get('Snackbar.cantUploadFile').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
      this.fileUploader.nativeElement.value = '';
      if (this.mode === 'show-box') {
        this.fileDropRef.nativeElement.value = '';
      } else if (this.mode === 'hidden-box') {
        this.fileDropRefHiddenBox.nativeElement.value = '';
      } else {
        this.fileDropRefHidden.nativeElement.value = '';
      }
      this.filesToUpload = [];
    });
  }

  onFileDropped($event) {
    // console.log(event);
    this.prepareFilesList($event);
    this.uploadFileToActivity();
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
    this.uploadFileToActivity();
  }

  deleteFile(index: number) {
    this.filesToUpload.splice(index, 1);
  }

  clickSelectFile(componentId): void {
    $(componentId).click();
  }


  async prepareFilesList(files: Array<any>) {
    for (const item of files) {
      // console.log(item);
      item.progress = 0;
      if (item.size > this.max_file_size) {
        this.openSnackBar(item.name + await this.translateService.get('Snackbar.tooLargeForUpload').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise());
      } else {
        this.filesToUpload.push(item);
        // this.uploadFilesSimulator(0);
      }
      // this.filesToUpload.push(item);
    }
  }

  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index >= this.filesToUpload.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.filesToUpload[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.filesToUpload[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: 'snack-bar-container',
      // direction: new TextDirectionController().getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

}
