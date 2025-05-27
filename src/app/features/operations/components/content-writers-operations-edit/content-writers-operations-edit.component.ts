import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content-writers-operations-edit',
  standalone:false,
  templateUrl: './content-writers-operations-edit.component.html',
  styleUrl: './content-writers-operations-edit.component.css'
})
export class ContentWritersOperationsEditComponent implements OnInit {
  emergencyRequestForm: FormGroup;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog, // Inject MatDialog
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<ContentWritersOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { monthlyTrackerId:number,clientId: number,contentInPost:any,contentCaption:any,referenceDoc:any,status:any,creativeType:any,title:any }
  ) {
    this.emergencyRequestForm = this.fb.group({
      contentInPost: ['', Validators.required],
      contentCaption: ['', Validators.required],
      title:[''],
      referenceDoc: [''],
      contentStatus: [2], // Default to draft
    });
  }
  ngOnInit(): void {
    console.log('creativeType:',this.data);
    if (this.data.creativeType === 2) {
      this.emergencyRequestForm.get('title')?.setValidators(Validators.required);
      this.emergencyRequestForm.get('title')?.updateValueAndValidity();
    }
    // Patch the form with existing data
    this.emergencyRequestForm.patchValue({
      contentInPost: this.data.contentInPost || '',
      contentCaption: this.data.contentCaption || '',
      title: this.data.title || '',
      referenceDoc: this.data.referenceDoc || '',
    });
  }
  saveDraft() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        monthlyTrackerId:this.data.monthlyTrackerId,
        clientId: this.data.clientId,
        contentStatus: 2, // Draft status
        createdBy: this.userId,
      };

      this.operationsService.UpdateContentWriterTracker(payload).subscribe(
        (response: string) => {
            console.log('Response from Save Draft:', response);
            if (response === 'Success') {
              this.openAlertDialog('Success', 'Draft Saved Successfully!');
            } else {
              this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
            }
            this.dialogRef.close(true); // Close the popup
          },
          (error: any) => {
            console.error('Error Saving Draft:', error);
            const errorMessage =
              error.error?.message ||
              'An unexpected error occurred while saving the draft.';
              this.openAlertDialog('Error', errorMessage);
          }
        );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  sendForApproval() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        monthlyTrackerId:this.data.monthlyTrackerId,
        clientId: this.data.clientId,
        contentStatus: 3, // Approval status
        createdBy: this.userId,
      };

      this.operationsService.UpdateContentWriterTracker(payload).subscribe(
        (response: string) => {
            console.log('Response from Send for Approval:', response);
            if (response === 'Success') {
              this.openAlertDialog('Success', 'Sent For Approval Successfully!');
            } else {
              this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
            }
            this.dialogRef.close(true); // Close the popup
          },
          (error: any) => {
            console.error('Error Sending for Approval:', error);
            const errorMessage =
              error.error?.message ||
              'An unexpected error occurred while sending for approval.';
              this.openAlertDialog('Error', errorMessage);
          }
        );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  close() {
    this.dialogRef.close(); // Close the popup
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
