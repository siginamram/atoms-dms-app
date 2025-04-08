import { Component, OnInit,ViewChild,Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { EmployeesService } from '../../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';

export interface PaymentData {
  organizationName: string;
  basePackage: number;
  advDate: string;
  paymentStatus: string;
  advAmount: number;
  [key: string]: any;
}

@Component({
  selector: 'app-clients-advance-payment',
  standalone:false,
  templateUrl: './clients-advance-payment.component.html',
  styleUrl: './clients-advance-payment.component.css'
})
export class ClientsAdvancePaymentComponent  implements OnInit {
  @Input() selectedDate!: moment.Moment | null;
   dateStr:any;
   dateStrend:any;
  isLoading = false; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id','organizationName', 'basePackage', 'advDate','advAmount', 'paymentStatus'];
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
      this.dateStrend = this.selectedDate.format('YYYY-MM') + '-30';
      this.fetchPaymentsForMonth();
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  fetchPaymentsForMonth(): void {
    this.isLoading = true; 
       //this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Default day is 01
    this.employeesService.GetClientsAdvancePaymentList(this.dateStr,  this.dateStrend).subscribe((res: any[]) => {
      this.isLoading = false; 
      this.dataSource.data = res.map(item => ({
        organizationName: item.organizationName,
        basePackage: item.basePackage,
        advDate: item.advDate && !item.advDate.includes('0001-01-01') ? item.advDate.split('T')[0] : 'N/A',
        paymentStatus: item.paymentStatus ,
        advAmount: item.advAmount 
      }));
    });
  }



    formatCurrency(value: number): string {
      return `₹${value.toLocaleString('en-IN')}`;
    }

  
  

 
}
