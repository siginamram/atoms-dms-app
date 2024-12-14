import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <div class="alert-dialog-container" [ngClass]="data.type">
      <mat-icon class="dialog-icon" [ngClass]="data.type">
        {{ getIconName() }}
      </mat-icon>
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-raised-button color="primary" (click)="onConfirm()">OK</button>
      </div>
    </div>
  `,
  styles: [
    `
      .alert-dialog-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        max-width: 400px;
        width: 90%;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        animation: fadeIn 0.3s ease-in-out;
        font-family: 'Roboto', sans-serif;
      }

      .dialog-icon {
        font-size: 60px;
        margin-bottom: 15px;
      }

      .dialog-icon.success {
        color: #4caf50; /* Green for success */
      }

      .dialog-icon.error {
        color: #f44336; /* Red for error */
      }

      .dialog-icon.warning {
        color: #ff9800; /* Orange for warning */
      }

      .dialog-title {
        font-size: 22px;
        font-weight: bold;
        color: #333333;
        margin: 10px 0;
      }

      .dialog-message {
        font-size: 16px;
        color: #666666;
        margin: 15px 0 20px;
        line-height: 1.5;
      }

      .dialog-actions {
        display: flex;
        justify-content: center;
        width: 100%;
      }

      .dialog-actions button {
        min-width: 120px;
        padding: 10px;
        font-size: 16px;
        border-radius: 8px;
        background-color: #3f51b5;
        color: white;
        transition: transform 0.2s;
      }

      .dialog-actions button:hover {
        background-color: #303f9f;
        transform: scale(1.05);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 600px) {
        .alert-dialog-container {
          padding: 15px;
          width: 95%;
        }

        .dialog-title {
          font-size: 18px;
        }

        .dialog-message {
          font-size: 14px;
        }

        .dialog-icon {
          font-size: 50px;
        }

        .dialog-actions button {
          font-size: 14px;
          padding: 8px;
        }
      }
    `,
  ],
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getIconName(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }
}
