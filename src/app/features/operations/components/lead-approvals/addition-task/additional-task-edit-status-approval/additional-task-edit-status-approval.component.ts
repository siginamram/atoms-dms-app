import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from 'src/app/features/operations/services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-task-edit-status-approval',
  standalone: false,
  templateUrl: './additional-task-edit-status-approval.component.html',
  styleUrl: './additional-task-edit-status-approval.component.css'
})
export class AdditionalTaskEditStatusApprovalComponent implements OnInit {
  editForm: FormGroup;
  statusOptions = [
    { value: 4, text: 'Changes recommended' },
    { value: 5, text: 'Approved' },
    { value: 6, text: 'Sent for client approval' },
    { value: 7, text: 'Lead approval Completed' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<AdditionalTaskEditStatusApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Role passed dynamically
  ) {
    this.editForm = this.fb.group({
      content:[this.data.content],
      status: ['', Validators.required],
      remarks: [{ value: '', disabled: true }, Validators.required]
    });
  }
  ngOnInit(): void {
    console.log('rk',this.data);
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
      const payload: any = {
        id: this.data.id, 
        type: this.data.type, 
        remarks: formData.remarks || '', 
        action: formData.content,
        status: formData.status
      };
  
     // payload.status = formData.status;
  
      this.operationsService.UpdateAdditionalTask(payload).subscribe({
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
