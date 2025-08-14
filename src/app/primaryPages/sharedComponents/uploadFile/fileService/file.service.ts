import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UploadResponseModel} from '../../../../DTOs/responseModel/UploadResponseModel';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  postFile(filesToUpload: Array<File>): Observable<HttpEvent<any>> {
    const endpoint = '/en-US/file/upload';
    const formData: FormData = new FormData();
    for (let f = 0; f < filesToUpload.length; f++) {
      formData.append('file' + f, filesToUpload[f], filesToUpload[f].name);
    }
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http
      .post <HttpEvent<any>>(endpoint, formData, {headers: headers, reportProgress: true, observe: 'events', responseType: 'json'});
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  typeDetector(name: string) {
    const temp = name.split('.');
    const type = temp[temp.length - 1].toLowerCase();
    if (type === 'mp4' || type === 'mov') {
      return 'video';
    }
    if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif' || type === 'tiff') {
      return 'picture';
    }
    if (type === 'mp3' || type === 'm4v' || type === 'wav') {
      return 'audio';
    } else {
      return 'other';
    }
  }
}
