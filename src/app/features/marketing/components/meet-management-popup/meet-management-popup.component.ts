import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { ActivatedRoute,Router } from '@angular/router';

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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commanApiService: MarketingService
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
    
    });
    this.loadLeads(); // Fetch leads when the component initializes
  }

  // Prevent past dates in the datepicker
  filterDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    return date ? date >= today : false; // Allow only today and future dates
  };

  // Load leads dynamically
  loadLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from localStorage
    const status = 1; // Default status to progressive

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any) => {
        this.leads = data; // Populate dropdown with leads
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
        meetID: this.meetID == null ? this.meetID : 0,
      };

      console.log('Payload for API:', payload); // Debug payload

      this.commanApiService.scheduleMeet(payload).subscribe(
        (response: any) => {
          console.log('Meeting Scheduled Successfully:', response);
          alert('Meeting scheduled successfully!');
          this.router.navigate(['/home/marketing/meet-management']);
          this.closePopup(); // Close the popup after submission
        },
        (error) => {
          console.error('Failed to schedule the meeting:', error);
          alert('Failed to schedule the meeting. Please try again.');
        }
      );
    } else {
      console.error('Form is invalid:', this.meetForm.errors);
    }
  }
}
