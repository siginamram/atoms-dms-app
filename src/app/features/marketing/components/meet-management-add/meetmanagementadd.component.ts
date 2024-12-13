import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-meetmanagementadd',
  templateUrl: './meetmanagementadd.component.html',
  styleUrls: ['./meetmanagementadd.component.css'],
})
export class MeetmanagementaddComponent implements OnInit {
  meetForm: FormGroup;
  uploadedImage: string | ArrayBuffer | null = null;
  meetID: number | null = null;
  leadID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private commanApiService: MarketingService,
    private Router:Router,
  ) {
    this.meetForm = this.fb.group({
      leadName: ['', Validators.required],
      meetingStatus: ['', Validators.required],
      travellingDuration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      waitingTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      meetingTime: ['', Validators.required],
      statusOfLead: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
      requireAnotherMeet: ['', Validators.required],
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

  loadMeetingDetails(meetID: number): void {
    this.commanApiService.getMeetingDetails(meetID).subscribe(
      (data: any) => {
        console.log('Fetched meeting details:', data);
        this.leadID=data.leadID;
        this.meetForm.patchValue({
          leadName: data.organizationName,
          meetingStatus: data.meetingStatus.toString(),
          travellingDuration: data.travellingDuration,
          waitingTime: data.waitingTime,
          meetingTime: data.meetingTime,
          statusOfLead: data.statusOfLead.toString(),
          longitude: data.longitude,
          latitude: data.latitude,
          requireAnotherMeet: data.requireAnotherMeet === true || data.requireAnotherMeet === 1 ? 1 : 0, // Normalize to 1/0
          nextMeetDate: data.nextMeetDate !== '0001-01-01T00:00:00' ? new Date(data.nextMeetDate) : null,
          nextMeetTime: data.nextMeetTime,
          insight: data.insight,
          selfie: data.photoUpload,
        });
      },
      (error) => {
        console.error('Failed to fetch meeting details:', error);
      }
    );
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
      const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
      const payload = {
        ...this.meetForm.value,
        meetID: this.meetID,
        leadID: this.leadID,
        salesPersonId: userId, // Add salesPersonId to the payload
        meetingStatus: parseInt(this.meetForm.value.meetingStatus, 10), // Ensure meetingStatus is an integer
        statusOfLead: parseInt(this.meetForm.value.statusOfLead, 10), // Ensure statusOfLead is an integer
        requireAnotherMeet: this.meetForm.value.requireAnotherMeet === 1 ? true : false,
      };
  
      this.commanApiService.updateMeeting(payload).subscribe(
        (response) => {
          alert('Meet details updated successfully!');
          this.Router.navigate(['/home/marketing/meet-management']);
        },
        (error) => {
          alert('Failed to update meet details. Please try again.');
          console.error('Failed to update meeting:', error);
        }
      );
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
  
  
}
