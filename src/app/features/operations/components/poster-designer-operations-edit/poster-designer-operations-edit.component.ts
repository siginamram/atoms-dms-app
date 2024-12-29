import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poster-designer-operations-edit',
  standalone:false,
  templateUrl: './poster-designer-operations-edit.component.html',
  styleUrls: ['./poster-designer-operations-edit.component.css'],
})
export class PosterDesignerOperationsEditComponent implements OnInit {
  constructor(  private dialog: MatDialog,
    public dialogRef: MatDialogRef<PosterDesignerOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trackerID: number; link: string; caption: string },
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    // Initialize data if necessary
    console.log('Edit Data:', this.data);
  }

  onSave(action: 'draft' | 'approval'): void {
    if (!this.data.link ) {
      //alert('Please fill in all required fields.');
      this.openAlertDialog('Error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      monthlyTrackerId: this.data.trackerID,
      link: this.data.link,
      graphicStatus: action === 'draft' ? 2 : 3, // 2: Draft, 3: Approval
      createdBy: parseInt(localStorage.getItem('UserID') || '0', 10), // User ID from localStorage
    };

    //console.log('Payload:', payload);

    this.operationsService.updateGraphicDesignLink(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', `${action === 'draft' ? 'Draft Saved' : 'Sent for Approval'} successfully!`);
        this.dialogRef.close(true); // Close the dialog and indicate success
      },
      error: (error) => {
        console.error('Error updating graphic design link:', error);
        this.openAlertDialog('Error', error);
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
        type: title.toLowerCase(), // success, error, or warning
      },
    });
  }
}
