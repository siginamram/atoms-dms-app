import { Component, OnInit,ViewChild,Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { EmployeesService } from '../../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'app-additional-services',
  standalone: false,
  templateUrl: './additional-services.component.html',
  styleUrl: './additional-services.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class AdditionalServicesComponent implements OnInit{

  @Input() selectedDate!: moment.Moment | null;
    dateStr:any;
  isLoading = false; 
  displayedColumns: string[] = ['id','Client','date', 'service', 'amount','type','payment', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  startDate = new FormControl(moment());
  endDate = new FormControl(moment());
  
  constructor(
    private employeesService: EmployeesService,
    private router: Router,
    public dialog: MatDialog
  ) {}
ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate) {
      this.dateStr = this.selectedDate.format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD');
      this.loadAdditionalServices();
    }
  }
  ngOnInit(): void {
    this.loadAdditionalServices();
  }

loadAdditionalServices() {
  this.isLoading = true;
  const dateToUse = this.selectedDate
    ? this.selectedDate.format('YYYY-MM-DD')
    : moment().format('YYYY-MM-DD');

  this.employeesService.GetNonDMClients(dateToUse).subscribe({
    next: (response: any[]) => {
      const mappedData = response.map((item, index) => ({
        id: item.id,
        client: item.organizationName,
        date: moment(item.date).format('DD-MM-YYYY'),
        service: item.invoiceNo || 'N/A',
        amount: item.totalAmount || 0,
        type: item.isGSTApplicable ? 'GST' : 'Non-GST',
        payment: this.getPaymentMode(item.paymentMode)

      }));

      this.dataSource.data = mappedData;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to fetch additional services:', err);
      this.isLoading = false;
    }
  });
}

getPaymentMode(mode: number): string {
  switch (mode) {
    case 1: return 'Cash';
    case 2: return 'Current Account';
    default: return 'Cash';
  }
}

  addGST(): void {
    this.router.navigate([`/home/employees/add-gst-invoices`]);
  }

}
