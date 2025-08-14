import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  private rotationSource = new BehaviorSubject(0);
  currentRotation = this.rotationSource.asObservable();

  constructor() {
  }

  changeRotation(rotation: number) {
    this.rotationSource.next(rotation);
  }
}
