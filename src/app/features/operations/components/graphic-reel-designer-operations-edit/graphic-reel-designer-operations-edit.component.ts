import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-graphic-reel-designer-operations-edit',
  standalone: false,
  templateUrl: './graphic-reel-designer-operations-edit.component.html',
  styleUrls: ['./graphic-reel-designer-operations-edit.component.css'],
})
export class GraphicReelDesignerOperationsEditComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<GraphicReelDesignerOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trackerID: number; link: string; caption: string,contentInPost:string,referenceDoc:string },
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    console.log('Edit Data:', this.data);
  }

  onSave(action: 'draft' | 'approval'): void {
    if (!this.data.link || !this.isValidUrl(this.data.link)) {
      this.openAlertDialog('Error', 'Please enter a valid URL.');
      return;
    }

    const payload = {
      monthlyTrackerId: this.data.trackerID,
      link: this.data.link,
      graphicStatus: action === 'draft' ? 2 : 3, // 2: Draft, 3: Approval
      createdBy: parseInt(localStorage.getItem('UserID') || '0', 10), // User ID from localStorage
    };

    this.operationsService.updateGraphicDesignLink(payload).subscribe({
      next: () => {
        this.openAlertDialog(
          'Success',
          `${action === 'draft' ? 'Draft Saved' : 'Sent for Approval'} successfully!`
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating graphic design link:', error);
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
