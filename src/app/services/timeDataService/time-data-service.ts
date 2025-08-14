import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TimeTrackDTO} from '../../DTOs/timeTrack/TimeTrackDTO';

@Injectable({
  providedIn: 'root'
})
export class TimeDataService {

  constructor() {
  }

  private newTimeTrackSource = new BehaviorSubject<TimeTrackDTO>(null);
  currentNewTimeTrack = this.newTimeTrackSource.asObservable();

  changecurrentNewTimeTrack(newTimeTrack: TimeTrackDTO) {
    this.newTimeTrackSource.next(newTimeTrack);
  }
}
