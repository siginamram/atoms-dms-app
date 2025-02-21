import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-approve-leaves-edit',
  standalone:false,
  templateUrl: './approve-leaves-edit.component.html',
  styleUrls: ['./approve-leaves-edit.component.css'],
})
export class ApproveLeavesEditComponent implements OnInit {
  leaveStatusForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ApproveLeavesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeesService: EmployeesService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.leaveStatusForm = this.fb.group({
      status: [1, Validators.required], // Default to "Approved"
      remarks: ['', Validators.maxLength(250)], // Optional, max length 250 chars
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (this.leaveStatusForm.invalid) return;

    const payload = {
      leaveId: this.data.leaveId,
      employeeId: parseInt(localStorage.getItem('empID') || '0', 10),
      status: this.leaveStatusForm.get('status')?.value,
      remarks: this.leaveStatusForm.get('remarks')?.value || 'No remarks',
    };

    this.employeesService.ApproveLeaveRequest(payload).subscribe({
      next: (response: string) => {
        if (response === 'Success') {
          this.openAlertDialog('Success', 'Leave status updated successfully!');
          this.dialogRef.close(true);
        } else {
          this.openAlertDialog('Error', response || 'Unexpected error occurred.');
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.openAlertDialog('Error', 'An error occurred while updating leave status.');
      }
    });
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() }
    });
  }
}
