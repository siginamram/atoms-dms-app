import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-meetmanagementadd',
  standalone:false,
  templateUrl: './meetmanagementadd.component.html',
  styleUrls: ['./meetmanagementadd.component.css'],
})
export class MeetmanagementaddComponent implements OnInit {
  meetForm: FormGroup;
  uploadedImage: string | ArrayBuffer | null = null;
  meetID: number | null = null;
  leadID: number | null = null;
  minDate: Date; // Variable to store today's date
  startTimeOptions: string[] = []; // Will hold the generated time options

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private commanApiService: MarketingService,
    private Router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.minDate = new Date(); // Set minDate to today's date

    this.meetForm = this.fb.group({
      leadName: ['', Validators.required],
      meetingStatus: ['', Validators.required],
      travellingDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')], // Validates numbers like 2.5 or 1
      ],
      waitingTime: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')], // Validates numbers like 1.30 or 0.5
      ],
      meetingTime: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')], // Validates numbers like 1.30 or 0.5
      ],
      statusOfLead: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
      requireAnotherMeet: [{value :'', disabled: true}, Validators.required],
      nextMeetDate: [''],
      nextMeetTime: [''],
      insight: ['', Validators.maxLength(500)],
      selfie: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.meetID = +params['id'];
      if (this.meetID) {
        this.loadMeetingDetails(this.meetID);
      }
    });
    // Generate the start time options when the component initializes
    this.startTimeOptions = this.generateStartTimeOptions();

    // Show/hide next meet fields dynamically
    this.meetForm.get('nextMeetRequired')?.valueChanges.subscribe((value) => {
      if (value === 'Yes') {
        this.meetForm.get('nextMeetDate')?.setValidators(Validators.required);
        this.meetForm.get('nextMeetTime')?.setValidators(Validators.required);
      } else {
        this.meetForm.get('nextMeetDate')?.clearValidators();
        this.meetForm.get('nextMeetTime')?.clearValidators();
      }
      this.meetForm.get('nextMeetDate')?.updateValueAndValidity();
      this.meetForm.get('nextMeetTime')?.updateValueAndValidity();
    });
  }

  generateStartTimeOptions(): string[] {
    const options: string[] = [];
    const startHour = 0; // 00:00 (12:00 AM)
    const endHour = 23; // 23:00 (11:00 PM)

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour === 0 || hour === 12 ? 12 : hour % 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedMinute = minute === 0 ? '00' : '30';
        options.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }

    return options;
  }

  changeStatusValue(event:any){
    if(event.value == 2 || event.value == 3){
      this.meetForm.patchValue({requireAnotherMeet: 0})
    }else{
      this.meetForm.patchValue({requireAnotherMeet: 1})
    }
  }

  loadMeetingDetails(meetID: number): void {
    this.commanApiService.getMeetingDetails(meetID).subscribe(
      (data: any) => {
        console.log('Fetched meeting details:', data);

        this.leadID = data.leadID;

        // Patch form values
        this.meetForm.patchValue({
          leadName: data.organizationName,
          meetingStatus: data.meetingStatus?.toString(),
          travellingDuration: data.travellingDuration || '',
          waitingTime: data.waitingTime || '',
          meetingTime: data.meetingTime || '',
          statusOfLead: data.statusOfLead?.toString(),
          longitude: data.longitude,
          latitude: data.latitude,
          requireAnotherMeet: data.requireAnotherMeet === true || data.requireAnotherMeet === 1 ? 1 : 0,
          nextMeetTime: data.nextMeetTime || '',
          insight: data.insight,
          selfie: data.photoUpload,
        });

        // Handle nextMeetDate separately
        if (data.nextMeetDate === '1970-01-01' || !data.nextMeetDate || data.nextMeetDate === '0001-01-01T00:00:00') {
          this.meetForm.patchValue({ nextMeetDate: null });
        } else {
          this.meetForm.patchValue({ nextMeetDate: new Date(data.nextMeetDate) });
        }
      },
      (error) => {
        console.error('Failed to fetch meeting details:', error);
      }
    );
  }

  onCancel(): void {
    this.Router.navigate(['/home/marketing/meet-management']);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result;
      };
      reader.readAsDataURL(file);
      this.meetForm.patchValue({ selfie: file.name });
    }
  }

  onSubmit(): void {
    if (this.meetForm.valid) {
      console.log()
      const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
      const payload = {
        ...this.meetForm.value,
        meetID: this.meetID,
        leadID: this.leadID,
        salesPersonId: userId, // Add salesPersonId to the payload
        meetingStatus: parseInt(this.meetForm.value.meetingStatus, 10), // Ensure meetingStatus is an integer
        statusOfLead: parseInt(this.meetForm.value.statusOfLead, 10), // Ensure statusOfLead is an integer
        requireAnotherMeet:this.meetForm.get('requireAnotherMeet')?.value ? true : false,
        nextMeetDate: this.formatDate(new Date(this.meetForm.value.nextMeetDate)),
      };
  
      this.commanApiService.updateMeeting(payload).subscribe(
        (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Meet details updated successfully!');
            this.Router.navigate(['/home/marketing/meet-management']);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected server response.');
          }
        },
        (error) => {
          this.openAlertDialog('Error', error.error ||   'Failed to update meet details. Please try again.');
          console.error('Failed to update meeting:', error);
        }
      );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }
  
  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
