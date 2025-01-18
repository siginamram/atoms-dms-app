import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-client-emergency-request',
  standalone: false,
  templateUrl: './add-client-emergency-request.component.html',
  styleUrls: ['./add-client-emergency-request.component.css'],
})
export class AddClientEmergencyRequestComponent implements OnInit {
  emergencyRequestForm: FormGroup;
  showSpinner: boolean = false;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  promotionTypes = [
    { id: 4, name: 'Emergency' },
  ];
  languages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Telugu' },
  ];
  creativeTypes = [
    { id: 1, name: 'Poster' },
    { id: 2, name: 'Graphic Reel' },
  ];

  emergencyType = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'Replace' },
  ];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog, // Inject MatDialog
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<AddClientEmergencyRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId: number }
  ) {
    this.emergencyRequestForm = this.fb.group({
      date: ['', Validators.required],
      creativeTypeId: ['', Validators.required],
      promotionId: ['', Validators.required],
      languageId: ['', Validators.required],
      speciality: [''],
      emergencyType:['',Validators.required],
      contentInPost: ['', Validators.required],
      contentCaption: ['', Validators.required],
      referenceDoc: [''],
      contentStatus: [2], // Default to draft
    });
  }

  ngOnInit(): void {}

  saveDraft() {
    if (this.emergencyRequestForm.valid) {
      this.showSpinner = true;
      const payload = {
        ...this.emergencyRequestForm.value,
        clientId: this.data.clientId,
        contentStatus: 2, // Draft status
        createdBy: this.userId,
        date: this.formatDate(new Date(this.emergencyRequestForm.value.date)),
      };

      this.operationsService.AddClientEmergencyRequest(payload).subscribe(
        (response: string) => {
            console.log('Response from Save Draft:', response);
            if (response === 'Success') {
              this.showSpinner = false;
              this.openAlertDialog('Success', 'Draft Saved Successfully!');
            } else {
              this.showSpinner = false;
              this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
            }
            this.dialogRef.close(true); // Close the popup
          },
          (error: any) => {
            console.error('Error Saving Draft:', error);
            this.showSpinner = false;
            const errorMessage =
              error.error?.message ||
              'An unexpected error occurred while saving the draft.';
              this.openAlertDialog('Error', errorMessage);
          }
        );
    } else {
      this.showSpinner = false;
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  sendForApproval() {
    if (this.emergencyRequestForm.valid) {
      this.showSpinner = true;
      const payload = {
        ...this.emergencyRequestForm.value,
        clientId: this.data.clientId,
        contentStatus: 3, // Approval status
        createdBy: this.userId,
        date: this.formatDate(new Date(this.emergencyRequestForm.value.date)),
      };

      this.operationsService.AddClientEmergencyRequest(payload).subscribe(
        (response: string) => {
            console.log('Response from Send for Approval:', response);
            if (response === 'Success') {
              this.showSpinner = false;
              this.openAlertDialog('Success', 'Sent For Approval Successfully!');
            } else {
              this.showSpinner = false;
              this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
            }
            this.dialogRef.close(true); // Close the popup
          },
          (error: any) => {
            this.showSpinner = false;
            console.error('Error Sending for Approval:', error);
            const errorMessage =
              error.error?.message ||
              'An unexpected error occurred while sending for approval.';
              this.openAlertDialog('Error', errorMessage);
          }
        );
    } else {
      this.showSpinner = false;
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

    // Utility function to format date as YYYY-MM-DD
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
}
