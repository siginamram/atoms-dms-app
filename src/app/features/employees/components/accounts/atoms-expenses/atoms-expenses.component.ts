import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAtomsExpensesComponent } from '../add-atoms-expenses/add-atoms-expenses.component';
import { EmployeesService } from '../../../services/employees.service';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-atoms-expenses',
  standalone: false,
  templateUrl: './atoms-expenses.component.html',
  styleUrls: ['./atoms-expenses.component.css']
})
export class AtomsExpensesComponent implements OnInit {
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  expenses= new MatTableDataSource<any>();
 
   fromDate = new FormControl(moment().startOf('month').format('YYYY-MM-DD')); // First day of current month
   toDate = new FormControl(moment().endOf('month').format('YYYY-MM-DD')); // Last day of current month

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private employeesService: EmployeesService
  ) {}

  purposeList: { id: number; name: string }[] = [
    { id: 1, name: 'AD Budget' },
    { id: 2, name: 'GST' },
    { id: 3, name: 'Salaries' },
    { id: 4, name: 'Rent' },
    { id: 5, name: 'Power Bill' },
    { id: 6, name: 'Monthly Groceries & Essentials' },
    { id: 7, name: 'Snacks' },
    { id: 8, name: 'Milk' },
    { id: 9, name: 'Water' },
    { id: 10, name: 'Expenses of Operational Transportation' },
    { id: 11, name: 'Marketing Expenses' },
    { id: 12, name: 'Mobile Recharges' },
    { id: 13, name: 'WiFi Recharges' },
    { id: 14, name: 'Others' },
    { id: 15, name: 'Employee Benefits' }
  ];
 
  getPurposeName(id: number): string {
    return this.purposeList.find(p => p.id === id)?.name || 'Unknown';
  }

  ngOnInit() {
    // ✅ Automatically update API when date changes
    this.fromDate.valueChanges.subscribe(() => this.setDefaultDateRange());
    this.toDate.valueChanges.subscribe(() => this.setDefaultDateRange());
    this.fetchExpenses();
  }
  ngAfterViewInit(): void {
    this.expenses.paginator = this.paginator; // Assign paginator after view initialization
  }
  /** ✅ Set default From Date and To Date to start and end of current month */
  setDefaultDateRange() {
     if (!this.fromDate.value || !this.toDate.value) {
          console.warn("⚠️ Both From and To dates are required!");
          return;
        }
        // ✅ Format dates as DD/MM/YYYY
        const fdate = moment(this.fromDate.value).format('DD/MM/YYYY');
        const tdate = moment(this.toDate.value).format('DD/MM/YYYY');
      
        if (moment(fdate, 'DD/MM/YYYY').isAfter(moment(tdate, 'DD/MM/YYYY'))) {
          console.warn("⚠️ 'From Date' cannot be after 'To Date'!");
          return;
        }
      
        console.log(`📅 Fetching data for: From ${fdate} → To ${tdate}`);
        this.fetchExpenses();
  }

  /** ✅ Fetch expenses from API */
  fetchExpenses() {
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');
    
    this.employeesService.GetExpenses(fdate, tdate).subscribe(
      (data: any) => {
        this.expenses = new MatTableDataSource(
          data.map((expense: any) => ({
            id: expense.id,
            date: formatDate(expense.date, 'dd/MM/yyyy', 'en'),
            person: expense.nameOfPerson,
            purpose: this.getPurposeName(expense.purpose),
            amount: expense.amount,
            invoice: expense.invoice,
            voucher: expense.vocher,
            source: expense.expensesFrom,
            remarks: expense.remarks || 'N/A'
          }))
        );
  
        // ✅ Assign paginator after updating data
        this.expenses.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  /** ✅ Calculate total expense */
totalExpense(): number {
  return this.expenses.data.reduce((sum, expense) => sum + expense.amount, 0);
}

  /** ✅ Open modal to add new expense */
  addExpense() {
    const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
      width: '650px',
      data: { isEdit: false, expenseData: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchExpenses(); // Refresh list
    });
  }

  /** ✅ Open modal to edit existing expense */
  editExpense(expense: any) {
    const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
      width: '650px',
      data: expense 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchExpenses(); // Refresh list
    });
  }
}