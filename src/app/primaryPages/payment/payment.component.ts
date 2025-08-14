import {Component, HostListener, OnInit, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TeamService} from '../../services/teamSerivce/team.service';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from 'src/app/services/accountService/account.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  teams: TeamDTO[];
  selectedTeamId: number;
  selectedTeam: TeamDTO;
  showLoading = false;
  status: string;
  authority: string;
  columnHeight;

  selectedPlan: string = 'free';
  billPeriod = 'monthly';
  seatCount;
  // Price is based on user per month.
  prices = {
    free: 0,
    basic: 3,
    pro: 5,
    enterprise: 'contactUs'
  };
  stringPrices = {
    free: '0',
    basic: '3',
    pro: '5',
    enterprise: 'contactUs'
  };
  maximumMembers = {
    free: 10,
    basic: 20,
    pro: 50,
    enterprise: 100
  };
  total = 0;
  totalString = '0';
  currency = 'dollar';
  packageId = 0;
  numbersFormatter;
  textDirection;

  constructor(private translateService: TranslateService,
              private teamService: TeamService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.selectedTeamId = +params['teamId'];
      this.route.queryParams.subscribe(async params => {
        this.status = params['Status'];
        this.authority = params['Authority'];
        
        if (this.status === 'NOK') {
          this._snackBar.open(await this.translateService.get('Snackbar.unsuccessfulPayment').toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
            });
          return;
        }
  
        if (this.authority && this.selectedTeamId) {
          this.teamService.checkPayment(this.selectedTeamId, this.authority).subscribe(async (success) => {
            // TODO Redirect to teams page.
            this.router.navigate(['/team/teamOverview/', this.selectedTeamId], {state: {paymentSuccessful: true}});
          }, async (err) => {
            this._snackBar.open(await this.translateService.get('Snackbar.invalidPaymentToken').toPromise(),
              await this.translateService.get('Buttons.gotIt').toPromise(),
              {
                duration: 2000,
                panelClass: 'snack-bar-container',
                direction:
                  TextDirectionController.getTextDirection() === 'ltr'
                    ? 'ltr'
                    : 'rtl',
              });
          });
        }
        if (this.authority == null || this.status == null) {
          return;
        }
      });
    });
    
    this.textDirection = TextDirectionController.textDirection;
    const culture = localStorage.getItem('languageCode');
    this.numbersFormatter = culture ? (new Intl.NumberFormat(culture)) :
      (new Intl.NumberFormat('en-US'));
    if (Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Tehran')) {
      this.prices = {
        free: 0,
        basic: 5000,
        pro: 20000,
        enterprise: 'contactUs'
      };
      this.stringPrices = {
        free: this.numbersFormatter.format(0),
        basic: this.numbersFormatter.format(5000),
        pro: this.numbersFormatter.format(20000),
        enterprise: 'contactUs'
      };
      this.currency = 'toman';
    }
    this.totalString = this.numbersFormatter.format(0);
  }

  ngOnInit(): void {
    this.columnHeight = window.innerHeight;
    this.getTeams();
  }

  async buyPackage() {
    if (this.seatCount < this.selectedTeam.numberOfMembers) {
      this._snackBar.open(await this.translateService.get('Snackbar.seatCountShouldBeGreater').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction:
              TextDirectionController.getTextDirection() === 'ltr'
                ? 'ltr'
                : 'rtl',
          });
      return;
    }
    if (this.seatCount > this.maximumMembers[this.selectedPlan]) {
      this._snackBar.open(await this.translateService.get('Snackbar.seatCountShouldBeSmaller').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction:
              TextDirectionController.getTextDirection() === 'ltr'
                ? 'ltr'
                : 'rtl',
          });
      return;
    }
    this.showLoading = true;
    this.teamService.createLink(this.selectedTeamId, this.packageId, this.seatCount, this.billPeriod === 'yearly').subscribe(async res => {

      window.location.href = res.value.toString();
      this.showLoading = false;

    });
  }

  getTeams() {
    this.teamService.getAllTeam().subscribe(res => {
      this.teams = res;
      this.selectedTeam = this.teams.find(x => x.id === this.selectedTeamId);
      this.seatCount = this.selectedTeam.numberOfMembers;
    });
  }

  selectPlan(plan: string, packageId: number) {
    this.selectedPlan = plan;
    this.packageId = packageId;
    // this.seatCount = Math.min(this.seatCount, this.maximumMembers[this.selectedPlan]);
    this.updateTotalPrice();
  }

  selectPeriod(period: string) {
    this.billPeriod = period;
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    if (this.seatCount) { 
      if (this.seatCount > this.maximumMembers[this.selectedPlan]) {
        for (let plan in this.maximumMembers) {
          if (this.seatCount <= this.maximumMembers[plan]) {
            this.selectedPlan = plan;
            this.packageId = this.prices[this.selectedPlan];
            break;
          }
        }
      }
      this.total = this.billPeriod === 'monthly' ? 
                   this.seatCount * this.prices[this.selectedPlan] :
                   this.seatCount * this.prices[this.selectedPlan] * 0.8 * 12;
      if (isNaN(this.total)) {
        this.total = 0;
      }
    } else {
      this.total = 0;
    }
    this.totalString = this.numbersFormatter.format(this.total);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.columnHeight = event.target.innerHeight;
  }

}
