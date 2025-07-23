import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-additional-task-clients-edit',
  standalone: false,
  templateUrl: './additional-task-clients-edit.component.html',
  styleUrl: './additional-task-clients-edit.component.css'
})
export class AdditionalTaskClientsEditComponent implements OnInit {
   @ViewChild('designForm') designForm!: NgForm;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AdditionalTaskClientsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    console.log('Edit Data:', this.data);
  }

onSave(action: 'draft' | 'approval'): void {
  const isCW = this.data.type === 1;
  const isDesigner = this.data.type === 2;

  const status = action === 'draft' ? 2 : 3; // Match with your enum values

  // Validate based on role
  if (isDesigner && (!this.data.url || !this.isValidUrl(this.data.url))) {
    this.openAlertDialog('Error', 'Please enter a valid design URL.');
    return;
  }

  if (isCW && (!this.data.content || this.data.content.trim() === '')) {
    this.openAlertDialog('Error', 'Content cannot be empty.');
    return;
  }

  const payload = {
    id: this.data.id,
    type: this.data.type,       // 1 or 2
    status: status,             // enum mapped number
    action: isCW ? this.data.content : this.data.url,
    remarks: '',                // Optional or use comment field if available
  };

  this.operationsService.UpdateAdditionalTask(payload).subscribe({
    next: () => {
      this.openAlertDialog(
        'Success',
        `${action === 'draft' ? 'Draft Saved' : 'Sent for Approval'} successfully!`
      );
      this.dialogRef.close(true);
    },
    error: (error) => {
      console.error('Error updating task:', error);
      this.openAlertDialog('Error', error.message || 'Something went wrong.');
    },
  });
}


  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type: title.toLowerCase(),
      },
    });
  }

  // Utility method for URL validation
  private isValidUrl(url: string): boolean {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return urlPattern.test(url);
  }
}
