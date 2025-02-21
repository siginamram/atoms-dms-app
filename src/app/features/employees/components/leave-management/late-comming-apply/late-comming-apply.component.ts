import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-late-comming-apply',
  standalone: false,
  templateUrl: './late-comming-apply.component.html',
  styleUrls: ['./late-comming-apply.component.css']
})
export class LateCommingApplyComponent implements OnInit {
  lateRequestForm: FormGroup;
  employeeId: number = parseInt(localStorage.getItem('empID') || '0', 10);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LateCommingApplyComponent>,
    private employeesService: EmployeesService,
    private dialog: MatDialog
  ) {
    this.lateRequestForm = this.fb.group({
      requestDate: ['', Validators.required],
      delayHours: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.lateRequestForm.valid) {
      const payload = {
        employeeId: this.employeeId,
        requestDate:this.formatDate(new Date(this.lateRequestForm.value.requestDate)),  
        delayHours: parseInt(this.lateRequestForm.get('delayHours')?.value, 10),
        reason: this.lateRequestForm.get('reason')?.value
      };

      this.employeesService.employeeLateRequest(payload).subscribe({
        next: (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Late Coming Request Submitted Successfully!');
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
