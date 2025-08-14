import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../services/accountService/account.service';
import {GoogleCodeScopeModelDTO} from '../../DTOs/integration/GoogleCodeScopeModelDTO';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private _accountService: AccountService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          const model: GoogleCodeScopeModelDTO = new GoogleCodeScopeModelDTO();
          model.code = params.code;
          model.scope = params.scope;
          this._accountService.setGoogleCode(model).subscribe(data => {
            this.router.navigate(['integrations']);
          }, error => {
            this.router.navigate(['integrations']);
          });
          console.log(params);
          // this.category = params.category;
          // console.log(this.category); // fiction
        }
      );
  }

}
