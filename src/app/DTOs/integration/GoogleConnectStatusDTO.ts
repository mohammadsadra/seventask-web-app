import {BaseResponseModel} from '../responseModel/BaseResponseModel';

export class GoogleConnectStatusResponseModel extends BaseResponseModel {
  value: GoogleConnectStatusDTO;
  constructor() {
    super();
    this.value = new GoogleConnectStatusDTO();
  }
}

export class GoogleConnectStatusDTO {
  hasConnectedKey: boolean;
  isActive: boolean;
}
