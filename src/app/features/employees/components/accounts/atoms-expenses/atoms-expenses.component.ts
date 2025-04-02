import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmployeesService } from '../../../services/employees.service';
import { AddAtomsExpensesComponent } from '../add-atoms-expenses/add-atoms-expenses.component';

@Component({
  selector: 'app-atoms-expenses',
  standalone:false,
  templateUrl: './atoms-expenses.component.html',
  styleUrls: ['./atoms-expenses.component.css']
})
export class AtomsExpensesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  expenses = new MatTableDataSource<any>();
  fromDate = new FormControl(moment().startOf('month').format('YYYY-MM-DD'));
  toDate = new FormControl(moment().endOf('month').format('YYYY-MM-DD'));
  isLoading = false;

  displayedColumns: string[] = ['id', 'date', 'person', 'purpose', 'amount', 'type',  'source', 'remarks', 'actions'];
  filterableColumns: string[] = ['date', 'person', 'purpose', 'type', 'source'];
  filterVisibility: any = {};
  filters: any = {};

  purposeList = [
    { id: 1, name: 'AD Budget' }, { id: 2, name: 'GST' }, { id: 3, name: 'Salaries' },
    { id: 4, name: 'Rent' }, { id: 5, name: 'Power Bill' }, { id: 6, name: 'Monthly Groceries & Essentials' },
    { id: 7, name: 'Snacks' }, { id: 8, name: 'Milk' }, { id: 9, name: 'Water' },
    { id: 10, name: 'Expenses of Operational Transportation' }, { id: 11, name: 'Marketing Expenses' },
    { id: 12, name: 'Mobile Recharges' }, { id: 13, name: 'WiFi Recharges' }, { id: 14, name: 'Others' },
    { id: 15, name: 'Employee Benefits' }
  ];

  constructor(private employeesService: EmployeesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.fromDate.valueChanges.subscribe(() => this.setDefaultDateRange());
    // this.toDate.valueChanges.subscribe(() => this.setDefaultDateRange());
    this.fetchExpenses();
  }
  applyDateFilter() {
    const from = moment(this.fromDate.value).format('YYYY-MM-DD');
    const to = moment(this.toDate.value).format('YYYY-MM-DD');
    if (moment(from).isBefore(to) || moment(from).isSame(to)) {
      this.fetchExpenses();
    }
  }
  
  ngAfterViewInit(): void {
    this.expenses.paginator = this.paginator;
    this.expenses.sort = this.sort;
    this.expenses.filterPredicate = (data, filter) => {
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
    this.expenses.filter = JSON.stringify(this.filters);
  }

  setDefaultDateRange() {
    const from = moment(this.fromDate.value).format('YYYY-MM-DD');
    const to = moment(this.toDate.value).format('YYYY-MM-DD');
    if (moment(from).isBefore(to) || moment(from).isSame(to)) {
      this.fetchExpenses();
    }
  }

  fetchExpenses(): void {
    this.isLoading = true;
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');
  
    this.employeesService.GetExpenses(fdate, tdate).subscribe((data: any[]) => {
      const formattedData = data.map((e) => ({
        id: e.id,
        date: formatDate(e.date, 'dd/MM/yyyy', 'en'),
        person: e.nameOfPerson,
        purpose: this.getPurposeName(e.purpose),
        amount: e.amount,
        type: e.type,
        biltype: e.biltype,
        source: e.expensesFrom,
        remarks: e.remarks || 'N/A'
      }));
  
      this.expenses = new MatTableDataSource(formattedData);
  
      setTimeout(() => {
        this.expenses.paginator = this.paginator;
        this.expenses.sort = this.sort;
        this.expenses.filterPredicate = (data, filter) => {
          const search = JSON.parse(filter);
          return Object.keys(search).every(key =>
            data[key]?.toString().toLowerCase().includes(search[key])
          );
        };
      });
  
      this.isLoading = false;
    }, _ => this.isLoading = false);
  }
  

  getPurposeName(id: number): string {
    return this.purposeList.find(p => p.id === id)?.name || 'Unknown';
  }

  addExpense() {
    const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
      width: '650px',
      data: { isEdit: false, expenseData: null }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchExpenses();
    });
  }

  editExpense(expense: any) {
    const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
      width: '650px',
      data: expense
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchExpenses();
    });
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.expenses.filteredData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Expenses.xlsx');
  }

  downloadPDF(): void {
    const DATA = document.getElementById('expensesTable');
    if (!DATA) return;
    html2canvas(DATA).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('Expenses.pdf');
    });
  }

  totalExpense(): number {
    return this.expenses.filteredData.reduce((sum, e) => sum + e.amount, 0);
  }
}
