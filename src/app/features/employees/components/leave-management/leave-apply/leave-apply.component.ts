import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service'; 
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-leave-apply',
  standalone: false,
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.css']
})
export class LeaveApplyComponent implements OnInit {
  leaveForm: FormGroup;
  employeeId: number = parseInt(localStorage.getItem('empID') || '0', 10);
  minDate = new Date(); // Disable past dates

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveApplyComponent>,
    private employeesService: EmployeesService,
    private dialog: MatDialog
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noOfDays: [{ value: 1, disabled: true }, [Validators.required, Validators.min(1)]], // Auto-calculated field
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  // Set minDate to 7 days ago from today
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7); // Subtract 7 days
  this.minDate = currentDate;

  this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateNoOfDays());
  this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateNoOfDays());
  }

  calculateNoOfDays(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      const diff = moment(endDate).diff(moment(startDate), 'days') + 1;
      this.leaveForm.patchValue({ noOfDays: diff > 0 ? diff : 1 });
    }
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      const payload = {
        leaveId: 0,
        employeeId: this.employeeId,
        startDate:this.formatDate(new Date(this.leaveForm.value.startDate)), 
        endDate: this.formatDate(new Date(this.leaveForm.value.endDate)), 
        noOfDays: this.leaveForm.get('noOfDays')?.value,
        leaveType: this.leaveForm.get('leaveType')?.value,
        reason: this.leaveForm.get('reason')?.value
      };

      this.employeesService.employeeLeaveRequest(payload).subscribe({
        next: (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Leave Request Submitted Successfully!');
            this.dialogRef.close(true);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected error. Please try again.');
          }
        },
        error: (error: any) => {
          console.error('API Error:', error);
          this.openAlertDialog('Error', 'An unexpected error occurred. Please try again.');
        }
      });
    } else {
      this.openAlertDialog('Error', 'Please fill in all required fields.');
    }
  }

    // Utility function to format date as YYYY-MM-DD
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
