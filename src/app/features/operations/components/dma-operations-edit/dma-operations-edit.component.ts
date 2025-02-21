import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dma-operations-edit',
  standalone: false,
  templateUrl: './dma-operations-edit.component.html',
  styleUrls: ['./dma-operations-edit.component.css']
})
export class DmaOperationsEditComponent implements OnInit {
  editForm: FormGroup;
  isFirstCase: boolean = false;
  minDate: Date ;
  maxDate: Date;
  statusOptions = [
    { value: 2, label: 'Early Post' },
    { value: 3, label: 'On Time Post' },
    { value: 4, label: 'Late Posted' },
    { value: 5, label: 'Client Rejected' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<DmaOperationsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Data to differentiate between cases
  ) {
    this.minDate = new Date('2020-01-31');
    this.maxDate = new Date('3000-01-31');
    this.isFirstCase = data.isFirstCase; // Determine case based on the flag
    this.editForm = this.fb.group({
      monthlyTrackerId: [data.meetingData?.monthlyTrackerId || 0, Validators.required],
      contentCaption:[data.meetingData?.contentCaption || null],
      contentInPost: [data.meetingData?.contentInPost || null],
      link:[data.meetingData?.link || null],
      scheduleDate: [data.meetingData?.postScheduleOn || null],
      status: [data.meetingData?.postStatus || 3, Validators.required],
      postedOn: [data.meetingData?.postedOn || null],
      remarks: [data.meetingData?.postRemarks || '']
    });
  }

  ngOnInit(): void {
    if (this.isFirstCase) {
      // First case: Disable fields not relevant
     // this.editForm.get('status')?.setValue(2); // Default status for "Scheduled"
      this.editForm.get('postedOn')?.disable();
      this.editForm.get('remarks')?.disable();
    } else {
      // Second case: Adjust form for posted statuses
      this.editForm.get('scheduleDate')?.disable();
    }
  }

  save(): void {
    const formData = this.editForm.getRawValue();

    if (this.isFirstCase) {
      // Save logic for the first case
      const payload = {
        monthlyTrackerId: formData.monthlyTrackerId,
        scheduleDate:formData.scheduleDate?this.formatDate(new Date(formData.scheduleDate)):'',
        creativeTypeId: this.data.meetingData.creativeTypeId
      };

      this.operationsService.UpdatePostScheduleDate(payload).subscribe({
        next: (response) => {
          //console.log('First case save success:', response);
          this.openAlertDialog('Success', `Post scheduled successfully!`);
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.openAlertDialog('Error', error);
        }
      });
    } else {
      // Save logic for the second case
      const payload = {
        monthlyTrackerId: formData.monthlyTrackerId,
        status: formData.status,
        postedOn: this.formatDate(new Date(formData.postedOn)),
        remarks: formData.remarks,
        creativeTypeId: this.data.meetingData.creativeTypeId
      };

      this.operationsService.UpdatePostStatus(payload).subscribe({
        next: (response) => {
         // console.log('Second case save success:', response);
          this.openAlertDialog('Success', `Posted successfully!`);
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.openAlertDialog('Error', error);
        }
      });
    }
  }

  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onStatusChange(value:any){
    if(value == 2){
       this.minDate = new Date('2020-01-31');
        this.maxDate = new Date(this.data.meetingData?.postScheduleOn) ;
        this.maxDate.setDate(this.maxDate.getDate() - 1);
    }
    else if(value == 3){
      this.minDate = new Date(this.data.meetingData?.postScheduleOn);
      this.maxDate = new Date(this.data.meetingData?.postScheduleOn);
      this.editForm.patchValue({
        postedOn :this.minDate
      })
    }
    else if(value == 4){
      this.minDate = new Date(this.data.meetingData?.postScheduleOn);
      this.minDate.setDate(this.minDate.getDate() + 1);
      this.maxDate = new Date('3000-01-31');
    }
    else if(value == 5){
      const currentDate = new Date(); // Get current date
      this.minDate = currentDate;
      this.maxDate = currentDate;
      
      this.editForm.patchValue({
        postedOn: currentDate // Set the form field to current date
      });
    }

  }

  cancel(): void {
    this.dialogRef.close(false);
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
