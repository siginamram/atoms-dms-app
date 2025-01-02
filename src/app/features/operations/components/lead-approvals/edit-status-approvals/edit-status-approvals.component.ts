import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-status-approvals',
  standalone:false,
  templateUrl: './edit-status-approvals.component.html',
  styleUrls: ['./edit-status-approvals.component.css']
})
export class EditStatusApprovalsComponent {
  editForm: FormGroup;
  statusOptions = [
    { value: 4, text: 'Changes recommended' },
    { value: 5, text: 'Approved' },
    { value: 6, text: 'Sent for client approval' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<EditStatusApprovalsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Role passed dynamically
  ) {
    this.editForm = this.fb.group({
      status: ['', Validators.required],
      remarks: [{ value: '', disabled: true }, Validators.required]
    });
  }

  onStatusChange(value: number) {
    if (value === 4) {
      this.editForm.get('remarks')?.enable();
    } else {
      this.editForm.get('remarks')?.disable();
      this.editForm.get('remarks')?.setValue('');
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      const payload = {
        monthlyTrackerId: this.data.monthlyTrackerId, // Assume this is passed via MAT_DIALOG_DATA
        status: formData.status,
        userId: this.data.userId, // Assume this is passed via MAT_DIALOG_DATA
        remarks: formData.remarks || '', // Optional field
        creativeTypeId: this.data.creativeType // Assume this is passed via MAT_DIALOG_DATA
      };
  
      this.operationsService.UpdateApprovalStatus(payload).subscribe({
        next: (response) => {
          this.openAlertDialog('Success', `Approval Status Updated!`);
          //console.log('Approval Status Updated:', response);
          this.dialogRef.close({ success: true, message: 'Status updated successfully!' });
        },
        error: (error) => {
          //console.error('Error Updating Status:', error);
          this.openAlertDialog('Error', error);
          this.dialogRef.close({ success: false, message: 'Failed to update status. Please try again.' });
        }
      });
    } else {
      this.openAlertDialog('Error', 'Form is invalid. Please complete all required fields.');
     //console.warn('Form is invalid. Please complete all required fields.');
    }
  }

  onCancel() {
    this.dialogRef.close(null);
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
