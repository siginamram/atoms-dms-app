import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveApplyComponent } from '../leave-apply/leave-apply.component'; 
import { LateCommingApplyComponent } from '../late-comming-apply/late-comming-apply.component';

@Component({
  selector: 'app-employee-leave-application',
  standalone:false,
  templateUrl: './employee-leave-application.component.html',
  styleUrls: ['./employee-leave-application.component.css']
})
export class EmployeeLeaveApplicationComponent {

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'leaveType',
    'noOfDays',
    'reason',
    'approvalStatus',
    'remarks',
  ];
  constructor(private dialog: MatDialog) {}
  appliedData = [
    {
      startDate: '2023-02-01',
      endDate: '2023-02-05',
      leaveType: 'Casual Leave',
      noOfDays: 5,
      reason: 'Personal',
      approvalStatus: 'Approved',
      remarks: 'Approved by Manager',
    },
    {
      startDate: '2023-02-10',
      endDate: '2023-02-12',
      leaveType: 'Sick Leave',
      noOfDays: 3,
      reason: 'Medical',
      approvalStatus: 'Pending',
      remarks: 'Awaiting approval',
    },
    {
      startDate: '2023-03-01',
      endDate: '2023-03-03',
      leaveType: 'Unpaid Leave',
      noOfDays: 3,
      reason: 'Travel',
      approvalStatus: 'Rejected',
      remarks: 'Insufficient balance',
    },
  ];
  openApplyLeavePopup(): void {
    this.dialog.open(LeaveApplyComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
    });
  }

  openLatecommingPopup(): void {
    this.dialog.open(LateCommingApplyComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
    });
  }
}
