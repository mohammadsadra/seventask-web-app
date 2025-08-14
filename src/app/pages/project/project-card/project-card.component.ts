import {Component, Input, OnInit} from '@angular/core';
import {ProjectDTO} from '../../../DTOs/project/Project';
import {DomainName} from '../../../utilities/PathTools';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() project: ProjectDTO;
  @Input() margin = '10px 7.5px 10px 7.5px';
  @Input() projectHover = '';

  domainName = DomainName;

  constructor() {
  }


  ngOnInit(): void {
  }

  hexToRgba(hex: string) {
    let c;
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    // tslint:disable-next-line:no-bitwise
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.1)';
  }

  projectOnHover(project) {
    this.projectHover = project.guid;
    document.documentElement.style.setProperty('--project-color', this.hexToRgba('#' + project.color));
  }

}
