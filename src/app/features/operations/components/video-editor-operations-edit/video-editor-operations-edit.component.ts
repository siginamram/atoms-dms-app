import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-video-editor-operations-edit',
  standalone: false,
  templateUrl: './video-editor-operations-edit.component.html',
  styleUrls: ['./video-editor-operations-edit.component.css'],
})
export class VideoEditorOperationsEditComponent implements OnInit {
  emergencyRequestForm: FormGroup;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<VideoEditorOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { monthlyTrackerId: number; editorLink: string; title: string; thumbNail: string; description: string }
  ) {
    this.emergencyRequestForm = this.fb.group({
      editorLink: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
          ),
        ],
      ],
      title: ['', Validators.required],
      thumbNail: [''],
      description: ['', Validators.required],
      status: [2], // Default to draft
    });
    
  }

  ngOnInit(): void {
    this.emergencyRequestForm.patchValue({
      editorLink: this.data.editorLink || '',
      title: this.data.title || '',
      thumbNail: this.data.thumbNail || '',
      description: this.data.description || '',
    });
  }

  saveDraft() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        monthlyTrackerId: this.data.monthlyTrackerId,
        status: 2, // Draft status
        createdBy: this.userId,
      };

      this.operationsService.UpdateClientMonthlyVideoURL(payload).subscribe({
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
        status: 3, // Approval status
        createdBy: this.userId,
      };

      this.operationsService.UpdateClientMonthlyVideoURL(payload).subscribe({
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
