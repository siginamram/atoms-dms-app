import { Component, OnInit, ViewChild ,Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
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
})
export class GstinvoicesComponent implements OnInit {
  @Input() selectedDate!: moment.Moment | null;
    dateStr:any;
  isLoading = false; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly date = new FormControl(moment());
  dataSource = new MatTableDataSource<InvoiceData>();
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
    private employeesService: EmployeesService,
        private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.fetchInvoices();
  }
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['selectedDate'] && this.selectedDate) {
        this.dateStr = this.selectedDate.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
        this.fetchInvoices();
      }
    }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchInvoices();
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  fetchInvoices(): void {
    this.isLoading = true; 
    //const selectedDate = this.date.value?.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
    this.employeesService.GetInvoicesByMonth(this.dateStr, 'true').subscribe((data: any[]) => {
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
      this.dataSource.data = formattedData;
      this.dataSource.paginator = this.paginator;
    });
  }
  /** ✅ Calculate total expense */
  totalExpense(): number {
    return this.dataSource.data.reduce((sum, expense) => sum + expense.totalGST, 0);
  }
  getFormattedTotalExpense(): string {
    return this.formatCurrency(this.totalExpense());
  }
  calculateNet(actual: number, adjusted: number): string {
    const diff = adjusted - actual;
    return diff === 0 ? 'No Change' : diff > 0 ? `Gain ₹${diff}` : `Loss ₹${Math.abs(diff)}`;
  }

 downloadInvoice(invoice: InvoiceData){
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'gst';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    console.log('Download Invoice:', invoice);
    this.router.navigate(['/home/employees/gst-invoices-download'], {
      queryParams: {
        invoice,
        tab: tab,
        date:date
      }
    });
  }

  editInvoice(invoice: InvoiceData): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'gst';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    console.log('Editing Invoice:', invoice);
    this.router.navigate([`/home/employees/add-gst-invoices`], {
      queryParams: {
        invoice,
        tab: tab,
        date:date
      }
    });
    
  }

  addGST(): void {
    this.router.navigate([`/home/employees/add-gst-invoices`]);
  }
}
