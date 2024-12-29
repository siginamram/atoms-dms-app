import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../services/operations.service';
import * as moment from 'moment';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-grapher-schedule-meet-popup',
  standalone:false,
  templateUrl: './photo-grapher-schedule-meet-popup.component.html',
  styleUrls: ['./photo-grapher-schedule-meet-popup.component.css'],
})
export class PhotoGrapherScheduleMeetPopupComponent implements OnInit {
  meetingForm: FormGroup;
  startTimeOptions: string[] = [];
  clients: any[] = [];
  filteredClients: any[] = [];
  disableStatus = false; // Disable meeting status for Add
  showAdditionalFields = false; // Control visibility of additional fields for 'Completed'

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog, // Inject MatDialog
    private dialogRef: MatDialogRef<PhotoGrapherScheduleMeetPopupComponent>,
    private operationsService: OperationsService,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; meetingData: any }
  ) {
    this.meetingForm = this.fb.group({
      organizationName: [data.meetingData?.organizationName || '', Validators.required],
      meetingStatus: [data.meetingData?.meetingStatus || 1, Validators.required],
      date: [data.meetingData?.date || '', Validators.required],
      time: [data.meetingData?.time || '', Validators.required],
      requirednoOfYTVideos: [data.meetingData?.noOfYouTubeVideos || ''],
      requirednoOfEDReels: [data.meetingData?.noOfEducationalReels || ''],
      noOfYTVideos: [data.meetingData?.noOfYTVideos || ''],
      noOfEDReels: [data.meetingData?.noOfEDReels || ''],
      shootLink: [data.meetingData?.shootLink || ''],
      remarks: [data.meetingData?.remarks || ''],
    });
  }

  ngOnInit(): void {
    this.startTimeOptions = this.generateStartTimeOptions();
    this.fetchClients();

    // Initialize form based on Add/Edit mode and status
    if (!this.data.isEdit) {
      this.disableStatus = true; // Disable meeting status for Add
    } else {
      this.onStatusChange(this.meetingForm.value.meetingStatus); // Set fields visibility
    }
  }

  generateStartTimeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedTime = moment({ hour, minute }).format('hh:mm A');
        options.push(formattedTime);
      }
    }
    return options;
  }

  fetchClients(): void {
    this.operationsService.getAllActiveClients().subscribe({
      next: (response) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (error) => console.error('Error fetching clients:', error),
    });
  }

  filterClients(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.organizationName.toLowerCase().includes(input)
    );
  }

  onClientSelected(event: any): void {
    const selectedClient = this.clients.find(
      (client) => client.organizationName === event.option.value
    );
    if (selectedClient) {
      this.meetingForm.patchValue({ organizationName: selectedClient.organizationName });
    }
  }

  onStatusChange(status: number): void {
    if (status === 2) {
      // Rescheduled
      this.showAdditionalFields = false;
    } else if (status === 3) {
      // Completed
      this.showAdditionalFields = true;
    }
  }

  save(): void {
    if (this.meetingForm.valid) {
      const formData = this.meetingForm.value;
      const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get the userId from localStorage
  
      // Prepare payload based on meetingStatus
      const payload: any = {
        id: this.data.meetingData?.meetId || 0,
        clientId: this.clients.find(
          (client) => client.organizationName === formData.organizationName
        )?.clientId || 0,
        date:this.formatDate(new Date(formData.date)),
        time: formData.time,
        remarks: formData.remarks,
        createdBy: userId,
        meetingStatus: formData.meetingStatus,
      };
  
      // Add additional fields for Completed status
      if (formData.meetingStatus === 3) {
        payload.shootLink = formData.shootLink;
        payload.noOfYTVideos = formData.noOfYTVideos || 0;
        payload.noOfEDReels = formData.noOfEDReels || 0;
      }
  
      // Call the respective API based on the meetingStatus
      let apiCall;
      if (!this.data.isEdit) {
        // Add new meeting
        apiCall = this.operationsService.photoGrapherScheduleMeet(payload);
      } else if (formData.meetingStatus === 2) {
        // Reschedule meeting
        apiCall = this.operationsService.photoGrapherRescheduleMeet(payload);
      } else if (formData.meetingStatus === 3) {
        // Complete meeting
        apiCall = this.operationsService.photoGrapherCompleteMeet(payload);
      } else {
        console.error('Invalid meeting status');
        return;
      }
  
      // Execute the API call
      apiCall.subscribe({
        next: (response: string) => {
          console.log('Save Response:', response);
          this.openAlertDialog('Success', 'Saved Successfully!');
          this.dialogRef.close({ success: true, message: response });
        },
        error: (error: any) => {
          console.error('Error saving meeting:', error);
          //this.dialogRef.close({ success: false, message: 'Failed to save meeting' });
          this.openAlertDialog('Error', 'Unexpected response. Please try again.');
        },
      });
    } else {
      console.error('Form is invalid');
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
      //this.dialogRef.close({ success: false, message: 'Invalid form data' });
    }
  }
  
  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.dialogRef.close(null);
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
