import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-apply',
  standalone:false,
  templateUrl: './leave-apply.component.html',
  styleUrl: './leave-apply.component.css'
})
export class LeaveApplyComponent {

  constructor(public dialogRef: MatDialogRef<LeaveApplyComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
