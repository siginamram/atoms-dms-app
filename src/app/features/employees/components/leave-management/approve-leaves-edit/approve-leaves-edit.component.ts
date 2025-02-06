import { Component } from '@angular/core';

@Component({
  selector: 'app-approve-leaves-edit',
  standalone: false,
  templateUrl: './approve-leaves-edit.component.html',
  styleUrls: ['./approve-leaves-edit.component.css'],
})
export class ApproveLeavesEditComponent {
  employeeName: string = '';
  leaveType: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  status: string = '';
  remarks: string = '';

  save(): void {
    console.log({
      employeeName: this.employeeName,
      leaveType: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      remarks: this.remarks,
    });
    // Add logic to save the data (e.g., call a service or close the dialog with data)
  }
}
