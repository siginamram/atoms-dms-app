import { Component,  Input, OnChanges, SimpleChanges, OnInit,ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeesService } from '../../../services/employees.service';
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
  invoiceNo: string;
  netlossgain?: number;
}

@Component({
  selector: 'app-non-gstinvoices',
  standalone:false,
  templateUrl: './non-gstinvoices.component.html',
  styleUrls: ['./non-gstinvoices.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class NonGstinvoicesComponent implements OnInit {
  isLoading = false; 
  @Input() selectedDate!: moment.Moment | null;
  dateStr:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly date = new FormControl(moment());
  dataSource = new MatTableDataSource<InvoiceData>();
  displayedColumns: string[] = [
    'id', 'client', 'invoicegenerationdate', 'invoiceNo', 'service',
    'actualAmount', 'adjustedAmount', 'netlossgain', 'actions'
  ];

  constructor(
    private router: Router,
    private employeesService: EmployeesService,
      private route: ActivatedRoute,
  ) {}
 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate) {
      this.dateStr = this.selectedDate.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
      this.fetchInvoices();
    }
  }
  ngOnInit(): void {
    this.fetchInvoices();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  fetchInvoices(): void {
    this.isLoading = true; 
    //const selectedDate = this.date.value?.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
    this.employeesService.GetInvoicesByMonth(this.dateStr, 'false').subscribe({
      next: (data: any[]) => {
        this.isLoading = false;
        const formattedData = data.map((item, index) => ({
          id: item.id,
          client: item.organizationName,
          invoicegenerationdate: moment(item.date).format('DD/MM/YYYY'),
          invoiceNo: item.invoiceNo,
          service: item.serviceOpted || 'N/A',
          actualAmount: item.amount,
          adjustedAmount: item.adjustedAmount,
          netlossgain: (item.totalAmount || 0) - (item.amount || 0),
        }));
        this.dataSource.data = formattedData;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
        this.isLoading = false; // IMPORTANT to stop spinner on error too
      }
    });
  
  }
    /** ✅ Calculate total expense */
    totalExpense(): number {
      return this.dataSource.data.reduce((sum, expense) => sum + expense.actualAmount, 0);
    }

    getFormattedTotalExpense(): string {
      return this.formatCurrency(this.totalExpense());
    }

    formatCurrency(value: number): string {
      return `₹${value.toLocaleString('en-IN')}`;
    }
 setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchInvoices();
  }
  downloadInvoice(invoice: InvoiceData){
      const tab = this.route.snapshot.queryParamMap.get('tab') || 'gst';
      const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    this.router.navigate(['/home/employees/non-gst-invoices-download'], {
      queryParams: {
        invoice,
        tab:tab,
        date:date
      }
    });
  }

  editInvoice(invoice: InvoiceData): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'gst';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    this.router.navigate([`/home/employees/add-non-gst-invoices`], {
      queryParams: {
        invoice,
        tab:tab,
        date:date
      }
    });
    
  }

  addGST(): void {
    this.router.navigate([`/home/employees/add-non-gst-invoices`]);
  }
}
