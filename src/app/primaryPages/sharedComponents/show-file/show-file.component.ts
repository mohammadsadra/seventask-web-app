import {Component, OnInit, Input} from '@angular/core';
import {FileService} from '../uploadFile/fileService/file.service';
import {DomainName} from '../../../utilities/PathTools';
import {FileDTO} from '../../../DTOs/file/FileDTO';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss'],
})
export class ShowFileComponent implements OnInit {
  @Input() data: any;
  @Input() type = 'string'; // it must be FILE or STRING
  domainName: string = DomainName;
  returnStr;
  fileIcons;
  fileAddress;
  fullName;
  sizeFormat;
  file: FileDTO;

  constructor(private fileservice: FileService) {
  }

  ngOnInit(): void {
    let Extension;
    if (this.type === 'string') {
      const Param = this.data;
      const NamePos = Param.indexOf('Name') + 7;
      this.fullName = Param.slice(NamePos, Param.indexOf(',') - 1);
      const strForName = Param.slice(Param.indexOf(','), Param.length);
      Extension = strForName.slice(14, strForName.indexOf('","'));

      const SizePos = Param.indexOf('"Size"') + 7;
      const Size = Param.slice(SizePos, Param.indexOf(',"FileContainerGuid"'));
      this.sizeFormat = this.fileservice.formatBytes(Number(Size));
      const FileContainerGuidPos = Param.indexOf('FileContainerGuid') + 20;
      const Strlength = Param.length - 3;
      const FileContainerGuid = Param.slice(FileContainerGuidPos, Strlength);
      this.fileAddress =
        this.domainName + '/en-US/file/get?id=' + FileContainerGuid;
    } else if (this.type === 'file') {
      this.file = this.data;
      Extension = this.file.extension;
      this.fullName = this.file.name;
      this.sizeFormat = this.fileservice.formatBytes(Number(this.file.size));
      this.fileAddress = this.domainName + '/en-US/file/get?id=' + this.file.fileContainerGuid;
    } else if (this.type === 'chat') {
      const Param = this.data;
      this.fullName = Param.split(':/:')[1];
      Extension = Param.split(':/:')[1].split('.')[Param.split(':/:')[1].split('.').length - 1];
      this.sizeFormat = this.fileservice.formatBytes(Number(Param.split(':/:')[3]));
      const FileContainerGuid = Param.split(':/:')[0];
      this.fileAddress =
        this.domainName + '/en-US/file/get?id=' + FileContainerGuid;
    } else {
      console.error('Wrong type!');
    }


    /* file Icone Select */
    let fileIcon;
    if (
      Extension.toLowerCase() === 'jpg' ||
      Extension.toLowerCase() === 'png' ||
      Extension.toLowerCase() === 'jpeg'
    ) {
      fileIcon = 'seventask-icon-ImageFile';
    } else if (Extension.toLowerCase() === 'pdf') {
      fileIcon = 'seventask-icon-PDFFile';
    } else if (Extension.toLowerCase() === 'svg') {
      fileIcon = 'seventask-icon-SVGFile';
    } else if (
      Extension.toLowerCase() === 'zip' ||
      Extension.toLowerCase() === 'rar' ||
      Extension.toLowerCase() === '7z'
    ) {
      fileIcon = 'seventask-icon-ArchivedFile';
    } else if (Extension.toLowerCase() === 'css') {
      fileIcon = 'seventask-icon-CSSFile';
    } else if (Extension.toLowerCase() === 'html') {
      fileIcon = 'seventask-icon-HTMLFile';
    } else if (Extension.toLowerCase() === 'js') {
      fileIcon = 'seventask-icon-JSFile';
    } else {
      fileIcon = 'seventask-icon-SimpleFile';
    }
    this.fileIcons = fileIcon;
  }

  goToHref(url: string) {
    window.open(url, '_self');
  }
}
