import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/accountService/account.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {
  connected = false;
  constructor(private router: Router,
              private _accountService: AccountService) {
  }

  ngOnInit(): void {
    this._accountService.getGoogleConnectStatus().subscribe((data) => {
      if (data.value) {
        this.connected = data.value.hasConnectedKey && data.value.isActive;
      }
    });
  }

  getGoogleCode() {
    const OAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'scope=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar&' +
      'access_type=offline&' +
      'include_granted_scopes=true&' +
      'response_type=code&' +
      'redirect_uri=' + location.origin + '/integration/google&' +
      'client_id=299366342223-dhci3ek2ea22j6b3110n4a8na0kc3fps.apps.googleusercontent.com';
    location.replace(encodeURI(OAuthUrl));
  }

}
