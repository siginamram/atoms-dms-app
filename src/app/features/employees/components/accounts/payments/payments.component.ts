import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
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
export class PaymentsComponent {
  activeTab: string = 'nongst'; // Default tab
  sharedDate = new FormControl(moment());
  triggeredDate: moment.Moment = this.sharedDate.value?.clone() ?? moment(); // Clone for change detection
  
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.sharedDate.value?.clone() ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.sharedDate.setValue(ctrlValue);
    datepicker.close();
  }
  
  onDateChange(): void {
    this.triggeredDate = this.sharedDate.value?.clone() ?? moment(); // safe clone
  }
  
}
