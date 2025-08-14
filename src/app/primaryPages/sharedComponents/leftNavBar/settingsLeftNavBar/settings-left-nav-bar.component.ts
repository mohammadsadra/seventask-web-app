import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../services/dataService/data.service';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings-left-nav-bar',
  templateUrl: './settings-left-nav-bar.component.html',
  styleUrls: ['./settings-left-nav-bar.component.scss'],
})
export class SettingsLeftNavBarComponent implements OnInit {
  activeTab = 'profile';
  direction = TextDirectionController.textDirection;
  iconRotationDegree = TextDirectionController.iconRotationDegree;

  constructor(
    private dataService: DataService,
    private directionService: DirectionService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    switch (this.router.url) {
      case '/settings':
        this.activeTab = 'profile';
        break;
      case '/timetrack':
        this.activeTab = 'timeTrack';
        break;
      case '/integrations':
        this.activeTab = 'integrations';
        break;
    }
    // this.activeTab = this.router.url === '/settings' ? 'profile' : 'timeTrack';
    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
    });
  }

  changeActiveTab(tab: string) {
    this.activeTab = tab;
    this.dataService.changeSettingsTab(tab);
  }
}
