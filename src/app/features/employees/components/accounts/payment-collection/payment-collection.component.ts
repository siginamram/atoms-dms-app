// payment-collection.component.ts
import { Component, OnInit,ViewChild,Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { EmployeesService } from '../../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface PaymentData {
  client: string;
  amount: number;
  dueDate: string;
  paymentStatus: string;
  type: string;
  [key: string]: any;
}

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
  selector: 'app-payment-collection',
  standalone:false,
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class PaymentCollectionComponent implements OnInit {
  @Input() selectedDate!: moment.Moment | null;
   dateStr:any;
  isLoading = false; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id','client', 'amount', 'dueDate','paymentDate', 'paymentStatus','paymentMode', 'type', 'actions'];
  dataSource = new MatTableDataSource<PaymentData>([]);
  date = new FormControl(moment());
  selectedDate1:any;
  filterVisibility: any = {};
  filters: any = {};

  constructor(
    private router: Router,
    private employeesService: EmployeesService,
    private dialog: MatDialog, // Inject MatDialog
  ) {}

  ngOnInit(): void {
  
    this.fetchPaymentsForMonth();
    this.date.valueChanges.subscribe(val => {
      if (val) this.fetchPaymentsForMonth();
    });

    this.dataSource.filterPredicate = (data, filter) => {
      const search = JSON.parse(filter);
      return Object.keys(search).every(key =>
        data[key]?.toString().toLowerCase().includes(search[key])
      );
    };
  }

  toggleFilterVisibility(column: string) {
    this.filterVisibility[column] = !this.filterVisibility[column];
  }
  
  applyFilter(event: any, column: string) {
    const value = event.target.value.trim().toLowerCase();
    this.filters[column] = value;
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate) {
      this.dateStr = this.selectedDate.format('YYYY-MM') + '-01';
      this.fetchPaymentsForMonth();
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    let ctrlValue = this.date.value ?? moment(); // fallback to current month
    ctrlValue = ctrlValue.clone().month(normalizedMonthAndYear.month()).year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchPaymentsForMonth(); // call updated function
  }
  

  fetchPaymentsForMonth(): void {
    this.isLoading = true; 
       //this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Default day is 01
    this.employeesService.GetPaymentCollection(this.dateStr).subscribe((res: any[]) => {
      this.isLoading = false; 
      this.dataSource.data = res.map(item => ({
        id:item.id,
        client: item.organizationName,
        amount: item.totalAmount,
        dueDate: item.dueDate && !item.dueDate.includes('0001-01-01') ? item.dueDate.split('T')[0] : 'N/A',
        paymentDate:item.dueDate && !item.paymentDate.includes('0001-01-01') ? item.paymentDate.split('T')[0] : 'N/A',
        paymentStatus: item.paymentStatus == 2  ? 'Paid' : 'Pending',
        paymentMode:item.paymentMode == 1 ? 'Cash' : item.paymentMode == 2 ? 'Current Account' : '',
        type: item.isGSTApplicable ? 'GST' : 'Non-GST'
      }));
    });
  }

 // ✅ Now return formatted strings instead of raw numbers
getFormattedTotalExpense(): string {
  const total = this.dataSource.data.reduce((sum, expense) => sum + expense.amount, 0);
  return this.formatCurrency(total);
}

getFormattedTotalPaidAmount(): string {
  const paid = this.dataSource.data
    .filter(item => item.paymentStatus === 'Paid')
    .reduce((sum, item) => sum + item.amount, 0);
  return this.formatCurrency(paid);
}

getFormattedTotalPendingAmount(): string {
  const pending = this.dataSource.data
    .filter(item => item.paymentStatus === 'Pending')
    .reduce((sum, item) => sum + item.amount, 0);
  return this.formatCurrency(pending);
}

    formatCurrency(value: number): string {
      return `₹${value.toLocaleString('en-IN')}`;
    }

    Invoices() {
      //this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Default day is 01
      
      this.employeesService.GenerateInvoice(this.dateStr).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res === 'Success') {
            this.openAlertDialog('Success', 'Invoice generated successfully!');
            this.fetchPaymentsForMonth(); // call updated function
          } else {
            this.openAlertDialog('Error', 'Unexpected response. Please try again.');
          }
        },
        error: (err) => {
          console.error('GenerateInvoice Error:', err);
          this.openAlertDialog('Error', 'Failed to generate invoice. Please try again later.');
        }
      });
    }
  

  editDetails(payment: PaymentData): void {
    this.router.navigate([`/home/employees/add-payment-collection`], {
      queryParams: {
        payment,
       date:this.dateStr,
       tab: 'paymentcollection',
      }
    });
  }
  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type: title.toLowerCase(), // success, error, or warning
      },
    });
  }
}
