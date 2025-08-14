export class SettingsDTO {
  public isDarkModeOn: boolean;
  public isSeondCalendarOn: boolean;
  public firstCalendar: number;
  public secondCalendar: number;
  public weekends: number[];
  public firstWeekDay: number;
  public themeColor: string;
  public zoomRatio: number;

  constructor(
    isDarkModeOn: boolean,
    isSeondCalendarOn: boolean,
    firstCalendar: number,
    secondCalendar: number,
    weekends: number[],
    firstWeekDay: number,
    themeColor: string,
    zoomRatio: number
  ) {}
}
