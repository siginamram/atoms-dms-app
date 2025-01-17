import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-meet-management-popup',
  standalone:false,
  templateUrl: './meet-management-popup.component.html',
  styleUrls: ['./meet-management-popup.component.css'],
})
export class MeetManagementPopupComponent implements OnInit {
  showSpinner: boolean=  false;
  meetForm: FormGroup;
  isPopupVisible = true;
  leads: any[] = []; // Dynamically loaded leads
  meetID: number | null = null;
  leadID: number | null = null;
  startTimeOptions: string[] = [];
  filteredLeads: any[] = []; // Filtered leads for autocomplete
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commanApiService: MarketingService,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.meetForm = this.fb.group({
      leadName: ['', Validators.required], // leadID
      meetMode: ['', Validators.required],
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
    this.showSpinner = true
    this.route.params.subscribe((params) => {
      this.meetID = +params['id'];
      if (this.meetID) {
        this.loadMeetingDetails(this.meetID); // Fetch meeting details, including leadID
        this.showSpinner = false
      } else {
        this.loadLeads(); // Load all leads if no meetID
        this.showSpinner = false
      }

      this.startTimeOptions = this.generateStartTimeOptions(); // Generate start time options
    });
  }
  filterLeads(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredLeads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(inputValue)
    );
  }
  onLeadSelected(event: any): void {
    const selectedLead = this.leads.find(
      (lead) => lead.leadID === event.option.value
    );
    if (selectedLead) {
      this.meetForm.patchValue({
        leadName: selectedLead.leadID, // Store leadID in the form
      });
    }
  }
  
  loadLeads(filterByLeadID?: number): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
    const status = 1; // Default status to progressive
  
    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any[]) => {
        this.leads = data;
        this.filteredLeads = filterByLeadID
          ? data.filter((lead) => lead.leadID === filterByLeadID)
          : data; // Initialize filteredLeads
      },
      (error) => {
        console.error('Failed to fetch leads:', error);
        this.leads = [];
        this.filteredLeads = [];
      }
    );
  }
  displayLeadName = (leadID: number): string => {
    const lead = this.leads.find((l) => l.leadID === leadID);
    return lead ? lead.organizationName : '';
  };
  
  getLeadName(leadID: number): string {
    const lead = this.leads.find((l) => l.leadID === leadID);
    return lead ? lead.organizationName : '';
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


  // Close the popup
  closePopup(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/home/marketing/meet-management']);
  }

  // Submit the form
  onSubmit(): void {
    this.showSpinner = true;  
    if (this.meetForm.valid) {
      const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
      const formData = this.meetForm.value;
  
      const payload = {
        leadID: formData.leadName, // leadName corresponds to leadID
        scheduledDate: this.formatDate(new Date(formData.scheduleDate)), // Date in string format
        scheduledTime: formData.scheduleTime, // Time in string format
        salesPersonID: userId, // Logged-in user's ID
        meetID: this.meetID || 0,
        modeOfMeet:this.meetForm.get('meetMode')?.value ? true : false,
      };
  
      console.log('Payload for API:', payload); // Debug payload
  
      this.commanApiService.scheduleMeet(payload).subscribe(
        (response: string) => {
          console.log('Response from API:', response);
  
          // Check if the response is 'Success'
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Meeting scheduled successfully!');
            this.closePopup(); // Close the popup after submission
          } else {
            this.openAlertDialog('Error', response || 'Unexpected server response.');
          }
          this.showSpinner = false;
        },
        (error) => {
          console.error('Failed to schedule the meeting:', error);
  
          // Handle error with a fallback message
          const errorMessage =
            error?.error ||
            'An unexpected error occurred while scheduling the meeting.';
          this.openAlertDialog('Error', errorMessage);
          this.showSpinner = false;
        }
      );
    } else {
      console.error('Form is invalid:', this.meetForm.errors);
      this.openAlertDialog('Error', 'Please fill in all required fields correctly.');
      this.showSpinner = false;
    }

  }
  
  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
