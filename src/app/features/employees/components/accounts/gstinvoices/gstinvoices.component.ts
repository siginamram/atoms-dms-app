import { Component, OnInit, ViewChild ,ChangeDetectionStrategy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeesService } from '../../../services/employees.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

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
  invoicegenerationdate: string;
  service: string;
  actualAmount: number;
  adjustedAmount: number;
  totalGST: number;
  invoiceNo: string;
  netlossgain: string;
}

@Component({
  selector: 'app-gstinvoices',
  standalone:false,
  templateUrl: './gstinvoices.component.html',
  styleUrls: ['./gstinvoices.component.css'],
     providers: [provideMomentDateAdapter(MY_FORMATS)],
     changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GstinvoicesComponent implements OnInit {
  isLoading = false; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly date = new FormControl(moment());
  invoices = new MatTableDataSource<InvoiceData>();
  displayedColumns: string[] = [
    'id',
    'client',
    'invoicegenerationdate',
    'invoiceNo',
    'service',
    'actualAmount',
    'adjustedAmount',
    'totalGST',
    'gst',
    'netlossgain',
    'actions',
  ];

  constructor(
    private router: Router,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.fetchInvoices();
  }
  ngAfterViewInit(): void {
    this.invoices.paginator = this.paginator;
  }
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    //this.isLoading = true; 
    const selectedDate = this.date.value?.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
    this.employeesService.GetInvoicesByMonth(selectedDate, 'true').subscribe((data: any[]) => {
      const formattedData = data.map((item, index) => ({
        id: item.id,
        client: item.organizationName,
        invoicegenerationdate: moment(item.date).format('DD/MM/YYYY'),
        invoiceNo: item.invoiceNo,
        service: item.serviceOpted || 'N/A',
        actualAmount: item.amount,
        adjustedAmount: item.adjustedAmount,
        totalGST: item.totalAmount,
        netlossgain: this.calculateNet(item.amount, item.adjustedAmount),
      }));
      this.isLoading = false; 
      this.invoices.data = formattedData;
    });
  }
  /** ✅ Calculate total expense */
  totalExpense(): number {
    return this.invoices.data.reduce((sum, expense) => sum + expense.totalGST, 0);
  }
  calculateNet(actual: number, adjusted: number): string {
    const diff = adjusted - actual;
    return diff === 0 ? 'No Change' : diff > 0 ? `Gain ₹${diff}` : `Loss ₹${Math.abs(diff)}`;
  }

 downloadInvoice(invoice: InvoiceData){
    console.log('Download Invoice:', invoice);
    this.router.navigate(['/home/employees/gst-invoices-download'], {
      queryParams: {
        invoice,
      }
    });
  }

  editInvoice(invoice: InvoiceData): void {
    console.log('Editing Invoice:', invoice);
    this.router.navigate([`/home/employees/add-gst-invoices`], {
      queryParams: {
        invoice,
      }
    });
    
  }

  addGST(): void {
    this.router.navigate([`/home/employees/add-gst-invoices`]);
  }
}
