import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LoadingService} from '../../../services/loadingService/loading.service';

@Component({
  selector: 'seventask-spinner',
  templateUrl: './seventask-spinner.component.html',
  styleUrls: ['./seventask-spinner.component.scss']
})
export class SeventaskSpinnerComponent implements OnInit {
  @Input() loadingType = 1;
  @Input() color = '';
  @Input() height = '150px';
  @Input() width = '150px';
  showSpinner = false;

  constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadingService.getSpinnerObserver().subscribe((status) => {
      this.showSpinner = (status === 'start');
      this.cdRef.detectChanges();
    });
  }

}
