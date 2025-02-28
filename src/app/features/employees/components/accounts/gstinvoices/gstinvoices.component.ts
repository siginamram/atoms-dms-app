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
export interface InvoiceData {
  id: number;
  client: string;
  invoicegenerationdate:string;
  service: string;
  actualAmount: number;
  adjustedAmount: number;
  totalGST: number;
  invoiceNo: string;
}

@Component({
  selector: 'app-gstinvoices',
  standalone:false,
  templateUrl: './gstinvoices.component.html',
  styleUrls: ['./gstinvoices.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
 changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GstinvoicesComponent {
  selectedMonth: string = '';
  readonly date = new FormControl(moment());
  constructor
  (
   private router: Router,
  )
  {}
  invoices: InvoiceData[] = [
    { id: 1, client: 'ABC Corp',invoicegenerationdate:'02/02/2025', service: 'Consulting', actualAmount: 5000, adjustedAmount: 4800, totalGST: 5600, invoiceNo: 'INV001' },
    { id: 2, client: 'XYZ Ltd', invoicegenerationdate:'02/02/2025',service: 'IT Support', actualAmount: 7000, adjustedAmount: 6800, totalGST: 7600, invoiceNo: 'INV002' },
    { id: 3, client: 'LMN Pvt',invoicegenerationdate:'02/02/2025', service: 'Marketing', actualAmount: 8000, adjustedAmount: 7800, totalGST: 8600, invoiceNo: 'INV003' }
  ];

  displayedColumns: string[] = ['id', 'client','invoicegenerationdate','invoiceNo', 'service', 'actualAmount', 'adjustedAmount', 'totalGST','netlossgain',  'actions'];

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  editInvoice(invoice: InvoiceData) {
    console.log('Editing Invoice:', invoice);
  }

  addGST(){
    this.router.navigate([`/home/employees/add-gst-invoices`]);
  }
}
