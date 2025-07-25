import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content-writer-videos-operations-edit',
  standalone:false,
  templateUrl: './content-writer-videos-operations-edit.component.html',
  styleUrl: './content-writer-videos-operations-edit.component.css'
})
export class ContentWriterVideosOperationsEditComponent implements OnInit {
  emergencyRequestForm: FormGroup;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<ContentWriterVideosOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { monthlyTrackerId: number; title: string; thumbNail: string; description: string,contentRemarks: string, cwInputsForVG: string, cwInputsForVE: string }
  ) {
    this.emergencyRequestForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      thumbNail: ['',],
      contentRemarks: ['', Validators.required],
      description: ['', Validators.required],
      cwInputsForVE: ['', Validators.required],
      cwInputsForVG: ['', Validators.required],
      contentStatus: [2], // Default to draft
    });
    
  }

  ngOnInit(): void {
    console.log('Popupd Data:',this.data);
    this.emergencyRequestForm.patchValue({
      title: this.data.title || '',
      thumbNail: this.data.thumbNail || '',
      description: this.data.description || '',
      contentRemarks: this.data.contentRemarks || '',
      cwInputsForVG: this.data.cwInputsForVE || '',  
      cwInputsForVE:this.data.cwInputsForVG || ''
    });
  }

  saveDraft() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        monthlyTrackerId: this.data.monthlyTrackerId,
      //  contentRemarks:  this.emergencyRequestForm.get('contentinVideo')?.value,
      // cwInputsForVG: this.emergencyRequestForm.get('inputForPhotoGrapher')?.value,
      // cwInputsForVE: this.emergencyRequestForm.get('inputForEditor')?.value,
        contentStatus: 2, // Draft status
        createdBy: this.userId,
      };

      this.operationsService.UpdateClientMonthlyVideoTitle(payload).subscribe({
        next: (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Draft Saved Successfully!');
            this.dialogRef.close(true);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'An unexpected error occurred while saving the draft.';
          this.openAlertDialog('Error', errorMessage);
        },
      });
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  sendForApproval() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        monthlyTrackerId: this.data.monthlyTrackerId,
        // contentRemarks:  this.emergencyRequestForm.get('contentinVideo')?.value,
        // cwInputsForVG: this.emergencyRequestForm.get('inputForPhotoGrapher')?.value,
        // cwInputsForVE: this.emergencyRequestForm.get('inputForEditor')?.value,
        contentStatus: 3, // Approval status
        createdBy: this.userId,
      };

      this.operationsService.UpdateClientMonthlyVideoTitle(payload).subscribe({
        next: (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Sent For Approval Successfully!');
            this.dialogRef.close(true);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'An unexpected error occurred while sending for approval.';
          this.openAlertDialog('Error', errorMessage);
        },
      });
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }
}

