import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ad-campaign-traker-edit',
  standalone: false,
  templateUrl: './ad-campaign-traker-edit.component.html',
  styleUrls: ['./ad-campaign-traker-edit.component.css'],
})
export class AdCampaignTrakerEditComponent implements OnInit {
  campaignForm: FormGroup;

  // Enum values with data
  platforms = [
    { value: 1, label: 'Facebook' },
    { value: 2, label: 'Instagram' },
    { value: 3, label: 'YouTube' },
  ];
  objectives = [
    { value: 1, label: 'Awareness' },
    { value: 2, label: 'Engagement' },
    { value: 3, label: 'Traffic' },
    { value: 4, label: 'Lead Generation' },
  ];
  resultTypes = [
    { value: 1, label: 'Reach' },
    { value: 2, label: 'Impressions' },
    { value: 3, label: 'Engagement' },
    { value: 4, label: 'Profile Visits' },
    { value: 5, label: 'WA Messages' },
    { value: 6, label: 'Leads Generation' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdCampaignTrakerEditComponent>
  ) {
    this.campaignForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      platform: ['', Validators.required],
      objective: ['', Validators.required],
      resultType: ['', Validators.required],
      result: ['', [Validators.required, Validators.min(0)]],
      costPerResult: ['', [Validators.required, Validators.min(0)]],
      reach: ['', [Validators.required, Validators.min(0)]],
      impressions: ['', [Validators.required, Validators.min(0)]],
      amountSpent: ['', [Validators.required, Validators.min(0)]],
      followersAfterCampaign: ['', [Validators.required, Validators.min(0)]],
      campaignLink: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Any initialization logic here
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.campaignForm.valid) {
      console.log('Form Submitted:', this.campaignForm.value);
      this.dialogRef.close(this.campaignForm.value);
    }
  }
}
