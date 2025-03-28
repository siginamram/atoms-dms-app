import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service';
import * as moment from 'moment';
import { ApproveLeavesEditComponent } from '../approve-leaves-edit/approve-leaves-edit.component';
import { LateCommingEditComponent } from '../late-comming-edit/late-comming-edit.component';

@Component({
  selector: 'app-approve-leaves',
  standalone: false,
  templateUrl: './approve-leaves.component.html',
  styleUrls: ['./approve-leaves.component.css'],
})
export class ApproveLeavesComponent implements OnInit {
    @ViewChild('fullTextDialog') fullTextDialog: any;
  empId: number = parseInt(localStorage.getItem('empID') || '0', 10);
  fromDate: Date = moment().startOf('month').toDate();
  toDate: Date = moment().endOf('month').toDate();

  applications: any[] = [];
  approvedLeaves: any[] = [];
  rejectedLeaves: any[] = [];
  lateRequests: any[] = [];

  displayedColumns: string[] = [
    'id',
    'employeeName',
    'leaveType',
    'startDate',
    'endDate',
    'noOfDays',
    'reason',
    'status',
    'action',
  ];

  // Define a separate column set for Late Coming requests
  displayedColumnsLate: string[] = [
    'id',
    'employeeName',
    'requestDate',
    'delayHours',
    'reason',
    'status',
    'action', 
  ];

  leaveTypeMap: Record<number, string> = {
    1: 'Sick Leave',
    2: 'Casual Leave',
    3: 'Annual Leave',
    4: 'Maternity Leave',
    5: 'Unpaid Leave',
  };

  statusMap: Record<number, string> = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
  };

  constructor(private employeesService: EmployeesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAllRequests();
  }

  fetchAllRequests() {
    const formattedFromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(this.toDate).format('YYYY-MM-DD');

    this.employeesService.GetApprovalLeaveRequests(this.empId, formattedFromDate, formattedToDate).subscribe((response) => {
      this.applications = response.filter((req: any) => req.status === 1);
      this.approvedLeaves = response.filter((req: any) => req.status === 2);
      this.rejectedLeaves = response.filter((req: any) => req.status === 3);
    });

    this.employeesService.GetApprovalLateRequests(this.empId, formattedFromDate, formattedToDate).subscribe((response) => {
      this.lateRequests = response;
    });
  }

  editRow(row: any): void {
    console.log('rk',row);
    const dialogRef = this.dialog.open(ApproveLeavesEditComponent, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllRequests();
      }
    });
  }

  editlateRow(row: any): void {
    console.log('rk',row);
    const dialogRef = this.dialog.open(LateCommingEditComponent, {
      width: '400px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllRequests();
      }
    });
  }

  showFullText(text: string, title: string): void {
    this.dialog.open(this.fullTextDialog, {
      width: '400px',
      data: {
        text: text,
        title: title,
      },
    });
  }
}
