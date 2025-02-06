import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApproveLeavesEditComponent } from '../approve-leaves-edit/approve-leaves-edit.component'; 

@Component({
  selector: 'app-approve-leaves',
  standalone:false,
  templateUrl: './approve-leaves.component.html',
  styleUrl: './approve-leaves.component.css'
})
export class ApproveLeavesComponent {

  constructor(public dialog: MatDialog) {}

  editRow(row: any): void {
  const dialogRef = this.dialog.open(ApproveLeavesEditComponent, {
    width: '400px',
    data: row,
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log('Dialog closed', result);
    // Handle the result here
  });
}
  displayedColumns: string[] = [
    'employeeName',
    'leaveType',
    'startDate',
    'endDate',
    'noOfDays',
    'description',
    'status',
    'action',
  ];

  dataSource = [
    {
      employeeName: 'John Doe',
      leaveType: 'Casual Leave',
      startDate: '2023-02-01',
      endDate: '2023-02-03',
      noOfDays: 3,
      description: 'Personal',
      status: 'Approved',
      remarks: 'Approved by Manager',
    },
    {
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2023-02-10',
      endDate: '2023-02-12',
      noOfDays: 3,
      description: 'Medical',
      status: 'Pending',
      remarks: 'Awaiting approval',
    },
    {
      employeeName: 'Tom Hardy',
      leaveType: 'Unpaid Leave',
      startDate: '2023-03-01',
      endDate: '2023-03-03',
      noOfDays: 3,
      description: 'Travel',
      status: 'Rejected',
      remarks: 'Insufficient balance',
    },
  ];

  // editRow(row: any): void {
  //   console.log('Editing row:', row);
  //   // Add your edit logic here, e.g., open a dialog for editing
  // }
  
  deleteRow(row: any): void {
    console.log('Deleting row:', row);
    // Add your delete logic here, e.g., show a confirmation dialog
  }
  
}
