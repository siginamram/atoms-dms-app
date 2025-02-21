import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service';
import { LeaveApplyComponent } from '../leave-apply/leave-apply.component';
import { LateCommingApplyComponent } from '../late-comming-apply/late-comming-apply.component';

@Component({
  selector: 'app-employee-leave-application',
  standalone:false,
  templateUrl: './employee-leave-application.component.html',
  styleUrls: ['./employee-leave-application.component.css']
})
export class EmployeeLeaveApplicationComponent implements OnInit {
  displayedColumns = ['id','startDate', 'endDate', 'leaveType', 'noOfDays', 'reason', 'status', 'remarks'];
  lateColumns = ['id','requestDate', 'delayHours', 'reason', 'status', 'remarks'];
  
  employeeId = parseInt(localStorage.getItem('empID') || '0', 10);
  leaveBalance: any;
  appliedData: any[] = [];
  approvedData: any[] = [];
  rejectedData: any[] = [];
  lateComingData: any[] = [];

// Explicitly type the keys to ensure proper indexing
leaveTypeMap: Record<number, string> = {
  1: 'Sick Leave',
  2: 'Casual Leave',
  3: 'Annual Leave',
  4: 'Maternity Leave',
  5: 'Unpaid Leave'
};

statusMap: Record<number, string> = {
  1: 'Pending',
  2: 'Approved',
  3: 'Rejected'
};


  constructor(private dialog: MatDialog, private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.feachdata();
  }

feachdata(){
  this.employeeService.GetEmpLeaveDashboard(this.employeeId).subscribe((response) => {
    this.leaveBalance = response.leaveBalanceSummary;
    this.appliedData = response.empLeaveRequests.filter((req: any)=> req.status === 1);
    this.approvedData = response.empLeaveRequests.filter((req: any)=> req.status === 2);
    this.rejectedData = response.empLeaveRequests.filter((req: any)=> req.status === 3);
    this.lateComingData = response.empLateRequests;
  });
}
  openApplyLeavePopup(): void {
    const dialogRef = this.dialog.open(LeaveApplyComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Operation Successful:', result);
        this.feachdata(); // Refresh the table after edit or save
      }
    });
  }

  openLatecommingPopup(): void {
    const dialogRef = this.dialog.open(LateCommingApplyComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Operation Successful:', result);
        this.feachdata(); // Refresh the table after edit or save
      }
    });
  }
}
