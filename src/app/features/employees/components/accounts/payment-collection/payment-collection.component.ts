import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import * as moment from 'moment';
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
export interface PaymentData {
  client: string;
  amount: number;
  dueDate: string;
  paymentStatus: string;
  type: string;
}

@Component({
  selector: 'app-payment-collection',
  standalone:false,
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css'],
   providers: [provideMomentDateAdapter(MY_FORMATS)],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCollectionComponent {
  selectedMonth: string = '';
    readonly date = new FormControl(moment());
  displayedColumns: string[] = ['client', 'amount', 'dueDate', 'paymentStatus', 'type', 'actions'];
  paymentStatusOptions: string[] = ['Paid', 'Pending'];
  typeOptions: string[] = ['GST', 'Non-GST'];
  constructor
  (
   private router: Router,
  )
  {}
  dataSource = new MatTableDataSource<PaymentData>([
    { client: 'ABC Corp', amount: 5000, dueDate: '2024-03-10', paymentStatus: 'Paid', type: 'GST' },
    { client: 'XYZ Ltd', amount: 7000, dueDate: '2024-03-15', paymentStatus: 'Pending', type: 'Non-GST' },
    { client: 'LMN Pvt', amount: 8000, dueDate: '2024-03-20', paymentStatus: 'Paid', type: 'GST' }
  ]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  viewDetails(payment: PaymentData) {
    this.router.navigate([`/home/employees/add-payment-collection`]);
  }
}
