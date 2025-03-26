// payment-collection.component.ts
import { ChangeDetectionStrategy, Component, OnInit,ViewChild } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCollectionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id','client', 'amount', 'dueDate', 'paymentStatus', 'type', 'actions'];
  dataSource = new MatTableDataSource<PaymentData>([]);
  date = new FormControl(moment());
  selectedDate:any;
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
       this.selectedDate = this.date.value?.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
    this.employeesService.GetPaymentCollection(this.selectedDate).subscribe((res: any[]) => {
      this.dataSource.data = res.map(item => ({
        id:item.id,
        client: item.organizationName,
        amount: item.totalAmount,
        dueDate: item.dueDate && !item.dueDate.includes('0001-01-01') ? item.dueDate.split('T')[0] : 'N/A',
        paymentStatus: item.paymentStatus == 2  ? 'Paid' : 'Pending',
        type: item.isGSTApplicable ? 'GST' : 'Non-GST'
      }));
    });
  }

  Invoices() {
    this.selectedDate = this.date.value?.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
    
    this.employeesService.GenerateInvoice(this.selectedDate).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res === 'Success') {
          this.openAlertDialog('Success', 'Invoice generated successfully!');
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
       date:this.selectedDate
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
