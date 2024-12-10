import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meet-management-popup',
  templateUrl: './meet-management-popup.component.html',
  styleUrls: ['./meet-management-popup.component.css'],
})
export class MeetManagementPopupComponent {

  meetForm: FormGroup;
  isPopupVisible = true; // Controls popup visibility
  leads = ['Tech Solutions', 'Green Energy', 'Future FinTech', 'Solar Innovations'];

  constructor(private fb: FormBuilder,private router: Router) {
    this.meetForm = this.fb.group({
      leadName: ['', Validators.required],
      scheduleDate: ['', Validators.required],
      scheduleTime: ['', Validators.required],
    });
  }

  // Close Popup
  closePopup() {
    this.isPopupVisible = false;
    this.router.navigate(['/home/marketing/meet-management']);
  }

  // Submit the form
  onSubmit() {
    if (this.meetForm.valid) {
      console.log('Form Submitted:', this.meetForm.value);
      this.closePopup(); // Close popup after submission
    } else {
      console.error('Form is invalid');
    }
  }
}
