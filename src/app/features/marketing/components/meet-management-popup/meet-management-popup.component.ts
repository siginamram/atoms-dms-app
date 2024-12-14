import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-meet-management-popup',
  templateUrl: './meet-management-popup.component.html',
  styleUrls: ['./meet-management-popup.component.css'],
})
export class MeetManagementPopupComponent implements OnInit {
  meetForm: FormGroup;
  isPopupVisible = true;
  leads: any[] = []; // Dynamically loaded leads
  meetID: number | null = null;
  leadID: number | null = null;
  startTimeOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commanApiService: MarketingService,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.meetForm = this.fb.group({
      leadName: ['', Validators.required], // leadID
      scheduleDate: ['', Validators.required], // scheduledDate
      scheduleTime: [
        '',
        [
          Validators.required,
          Validators.pattern(/^((0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM))$/i), // Validate hh:mm AM/PM
        ],
      ], // scheduledTime
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.meetID = +params['id'];
      if (this.meetID) {
        this.loadMeetingDetails(this.meetID); // Fetch meeting details, including leadID
      } else {
        this.loadLeads(); // Load all leads if no meetID
      }

      this.startTimeOptions = this.generateStartTimeOptions(); // Generate start time options
    });
  }

  generateStartTimeOptions(): string[] {
    const options: string[] = [];
    const startHour = 0; // 00:00 (12:00 AM)
    const endHour = 23; // 23:00 (11:00 PM)

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour === 0 ? 12 : hour <= 12 ? hour : hour - 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedMinute = minute === 0 ? '00' : '30';
        options.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }

    return options;
  }

  loadMeetingDetails(meetID: number): void {
    this.commanApiService.getMeetingDetails(meetID).subscribe(
      (data: any) => {
        console.log('Fetched meeting details:', data);
        this.leadID = data.leadID;

        // Load specific leadID if available
        if (this.leadID) {
          this.loadLeads(this.leadID);
        }
      },
      (error) => {
        console.error('Failed to fetch meeting details:', error);
      }
    );
  }

  // Prevent past dates in the datepicker
  filterDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    return date ? date >= today : false; // Allow only today and future dates
  };

  // Load leads dynamically
  loadLeads(filterByLeadID?: number): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
    const status = 1; // Default status to progressive

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any[]) => {
        if (filterByLeadID) {
          // Filter specific leadID if provided
          this.leads = data.filter((lead) => lead.leadID === filterByLeadID);

          if (this.leads.length === 0) {
            console.warn(`No lead found with ID: ${filterByLeadID}`);
          }
        } else {
          // Otherwise bind all leads
          this.leads = data;
        }
      },
      (error) => {
        console.error('Failed to fetch leads:', error);
        this.leads = [];
      }
    );
  }

  // Close the popup
  closePopup(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/home/marketing/meet-management']);
  }

  // Submit the form
  onSubmit(): void {
    if (this.meetForm.valid) {
      const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
      const formData = this.meetForm.value;

      const payload = {
        leadID: formData.leadName, // leadName corresponds to leadID
        scheduledDate: formData.scheduleDate, // Date in string format
        scheduledTime: formData.scheduleTime, // Time in string format
        salesPersonID: userId, // Logged-in user's ID
        meetID: this.meetID || 0,
      };

      console.log('Payload for API:', payload); // Debug payload

      this.commanApiService.scheduleMeet(payload).subscribe(
        (response: any) => {
          console.log('Meeting Scheduled Successfully:', response);
          this.openAlertDialog('Success', 'Meeting scheduled successfully!');
          this.closePopup(); // Close the popup after submission
        },
        (error) => {
          console.error('Failed to schedule the meeting:', error);
          this.openAlertDialog('Error', 'Failed to schedule the meeting. Please try again.');
        }
      );
    } else {
      console.error('Form is invalid:', this.meetForm.errors);
    }
  }

  // Open a custom alert dialog
  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type: title.toLowerCase(), // success, error, warning
      },
    });
  }
}
