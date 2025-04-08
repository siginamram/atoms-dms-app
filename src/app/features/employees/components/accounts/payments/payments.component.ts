import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-payments',
  standalone:false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class PaymentsComponent implements OnInit {
  activeTab: string = 'paymentcollection';
  sharedDate = new FormControl(moment());
  triggeredDate: moment.Moment = moment();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      const dateParam = params['date'];

      // Set tab from query param if valid
      if (tabParam && ['advancepayment','paymentcollection', 'gst', 'nongst'].includes(tabParam)) {
        this.activeTab = tabParam;
      }

      // Set date from query param if valid
      if (dateParam) {
        const parsedDate = moment(dateParam, 'YYYY-MM');
        if (parsedDate.isValid()) {
          this.sharedDate.setValue(parsedDate);
          this.triggeredDate = parsedDate.clone();
        }
      } else {
        this.triggeredDate = this.sharedDate.value?.clone() ?? moment();
      }
    });
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.sharedDate.value?.clone() ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.sharedDate.setValue(ctrlValue);
    datepicker.close();
  }

  onDateChange(): void {
    this.triggeredDate = this.sharedDate.value?.clone() ?? moment();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab: this.activeTab,
        date: this.sharedDate.value?.format('YYYY-MM')
      },
      queryParamsHandling: 'merge'
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab,
        date: this.sharedDate.value?.format('YYYY-MM')
      },
      queryParamsHandling: 'merge'
    });
  }
}
