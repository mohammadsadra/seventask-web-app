export class HomeSettingsDTO {
  public isRightPanelVisible: boolean;
  public rightPanelWidth: number;
  public leftPanelWidth: number;


  constructor(
    isRightPanelVisible: boolean,
    rightPanelWidth: number,
    leftPanelWidth: number
  ) {
    this.isRightPanelVisible = isRightPanelVisible;
    this.rightPanelWidth = rightPanelWidth;
    this.leftPanelWidth = leftPanelWidth;
  }
}
