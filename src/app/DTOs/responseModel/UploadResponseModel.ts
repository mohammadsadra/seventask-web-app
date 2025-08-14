import {BaseResponseModel} from './BaseResponseModel';
import {FileDTO} from '../file/FileDTO';

export class UploadResponseModel extends BaseResponseModel {
  value: {
    uploadedCompletely: boolean,
    unsuccessfulFileUpload: Array<string>;
    successfulFileUpload: Array<FileDTO>;
  };
}
