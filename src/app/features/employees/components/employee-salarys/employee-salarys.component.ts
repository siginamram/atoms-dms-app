import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmployeesService } from '../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeUpdateSalaryStatusComponent } from '../employee-update-salary-status/employee-update-salary-status.component';

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
  selector: 'app-employee-salarys',
  standalone: false,
  templateUrl: './employee-salarys.component.html',
  styleUrls: ['./employee-salarys.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class EmployeeSalarysComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedMonth = new FormControl(moment().subtract(1, 'month'));
  isLoading = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'employeeName',
    'basePay',
    'perDay',
    'unpaidLeaves',
    'deductions',
    'salary',
    'paymentAmount',
    'paymentStatus',
    'paymentDate',
    'action'
  ];

  constructor(
    private employeesService: EmployeesService,
    private dialog: MatDialog, // Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchSalaryData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.selectedMonth.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.selectedMonth.setValue(ctrlValue);
    datepicker.close();
  }

  fetchSalaryData(): void {
    const monthStr = this.selectedMonth.value?.format('YYYY-MM') ?? moment().format('YYYY-MM');
    this.isLoading = true;

    this.employeesService.GetSalaryTransactionsByMonth(monthStr).subscribe((res: any) => {
      const data = typeof res === 'string' ? JSON.parse(res) : res;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, _ => this.isLoading = false);
  }
  /** ✅ Calculate total expense */
  totalExpense(): number {
    return this.dataSource.data.reduce((sum, salarys) => sum + salarys.salary, 0);
  }

  Salary() {
    const monthStr = this.selectedMonth.value?.format('YYYY-MM') ?? moment().format('YYYY-MM');
    this.employeesService.GenerateMonthlySalaryForecast(monthStr).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res === 'Success') {
          this.openAlertDialog('Success', 'Employee Salaries generated successfully!');
          this.fetchSalaryData(); // call updated function
        } else {
          this.openAlertDialog('Error', 'Unexpected response. Please try again.');
        }
      },
      error: (err) => {
        console.error('GenerateInvoice Error:', err);
        this.openAlertDialog('Error', 'Failed to Employee Salaries . Please try again later.');
      }
    });
  }
  

  editstatus(transaction:any): void {
    console.log('transactionId',transaction);
    const dialogRef = this.dialog.open(EmployeeUpdateSalaryStatusComponent, {
      width: '650px',
      data: transaction
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchSalaryData();
    });
   }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'EmployeeSalary.xlsx');
  }

  exportToPDF(): void {
    const DATA:any = document.querySelector('.table-container');
    if (!DATA) return;

    html2canvas(DATA).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('EmployeeSalary.pdf');
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
