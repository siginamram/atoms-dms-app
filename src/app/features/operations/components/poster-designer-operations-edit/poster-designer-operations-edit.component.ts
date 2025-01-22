import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poster-designer-operations-edit',
  standalone: false,
  templateUrl: './poster-designer-operations-edit.component.html',
  styleUrls: ['./poster-designer-operations-edit.component.css'],
})
export class PosterDesignerOperationsEditComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PosterDesignerOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trackerID: number; link: string; contentCaption: string,contentInPost:string,referenceDoc:string },
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    console.log('Edit Data:', this.data);
  }

  onSave(action: 'draft' | 'approval'): void {
    if (!this.isValidUrl(this.data.link)) {
      this.openAlertDialog('Error', 'Please enter a valid URL ending with .com, .net, .in, etc.');
      return;
    }

    const payload = {
      monthlyTrackerId: this.data.trackerID,
      link: this.data.link,
      graphicStatus: action === 'draft' ? 2 : 3,
      createdBy: parseInt(localStorage.getItem('UserID') || '0', 10),
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
        this.openAlertDialog('Error', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
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

  isValidUrl(url: string): boolean {
    // Regex to ensure URL ends with a valid domain extension like .com, .net, .in, etc.
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*\.(com|net|in|org|gov|edu)(\/.*)?$/;
    return urlPattern.test(url);
  }
}
