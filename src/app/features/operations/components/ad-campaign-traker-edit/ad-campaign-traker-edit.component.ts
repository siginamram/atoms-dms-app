import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../services/operations.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-ad-campaign-traker-edit',
  standalone:false,
  templateUrl: './ad-campaign-traker-edit.component.html',
  styleUrls: ['./ad-campaign-traker-edit.component.css'],
})
export class AdCampaignTrakerEditComponent implements OnInit {
  campaignForm: FormGroup;
  isEdit: boolean = false;
  campaignId: number = 0;
  clientId: number = 0;

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
    private dialogRef: MatDialogRef<AdCampaignTrakerEditComponent>,
    private operationsService: OperationsService,
    private router: Router,
    private dialog: MatDialog, // Inject MatDialog
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data for edit case
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
      followersBeforeCampaign: ['', [Validators.required, Validators.min(0)]],
      followersAfterCampaign: ['', [Validators.required, Validators.min(0)]],
      campaignLink: ['', [Validators.required, Validators.pattern('https?://.*')]],
      isCampaignCompleted: ['', Validators.required],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.campaignId) {
      // Set edit mode if campaignId exists in data
      console.log('Edit Mode: Data received:', this.data);
      this.isEdit = true;
      this.campaignId = this.data.campaignId;
      this.bindCampaignData(this.data);
    } else {
      // Set add mode if no campaignId
      console.log('Add Mode: No data received for editing.');
      this.isEdit = false;
    }
  
    // Get clientId from query params for both add and edit cases
    this.route.queryParams.subscribe((params) => {
      this.clientId = Number(params['clientId']) || 0;
      console.log('Client ID from Query Params:', this.clientId);
    });
  }
  
  bindCampaignData(campaignData: any): void {
    this.campaignForm.patchValue({
      fromDate: moment(campaignData.campaignStartDate).toDate(),
      toDate: moment(campaignData.campaignEndDate).toDate(),
      targetAmount: campaignData.targetBudget,
      platform: campaignData.platform,
      objective: campaignData.objective,
      resultType: campaignData.resultType,
      result: campaignData.result,
      costPerResult: campaignData.costPerResult,
      reach: campaignData.reach,
      impressions: campaignData.impressions,
      amountSpent: campaignData.amountSpent,
      followersBeforeCampaign: campaignData.followersBeforeCampaign,
      followersAfterCampaign: campaignData.followersAfterCampaign,
      campaignLink: campaignData.campaignCreativeLink,
      isCampaignCompleted: campaignData.isCampaignCompleted,
      remarks: campaignData.remarks,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
    // Utility function to format date as YYYY-MM-DD
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  onSubmit(): void {
    if (this.campaignForm.valid) {
      const userId = +localStorage.getItem('UserID')!;
      const payload = {
        campaignId: this.isEdit ? this.campaignId : 0,
        clientId: this.clientId,
        campaignStartDate: this.formatDate(new Date(this.campaignForm.get('fromDate')?.value)),//moment(this.campaignForm.get('fromDate')?.value).toISOString(),
        campaignEndDate: this.formatDate(new Date(this.campaignForm.get('toDate')?.value)),//moment(this.campaignForm.get('toDate')?.value).toISOString(),
        targetBudget: this.campaignForm.get('targetAmount')?.value,
        platform: this.campaignForm.get('platform')?.value,
        objective: this.campaignForm.get('objective')?.value,
        resultType: this.campaignForm.get('resultType')?.value,
        result: this.campaignForm.get('result')?.value,
        costPerResult: this.campaignForm.get('costPerResult')?.value,
        reach: this.campaignForm.get('reach')?.value,
        impressions: this.campaignForm.get('impressions')?.value,
        amountSpent: this.campaignForm.get('amountSpent')?.value,
        followersBeforeCampaign: this.campaignForm.get('followersBeforeCampaign')?.value,
        followersAfterCampaign: this.campaignForm.get('followersAfterCampaign')?.value,
        campaignCreativeLink: this.campaignForm.get('campaignLink')?.value,
        isCampaignCompleted: this.campaignForm.get('isCampaignCompleted')?.value,
        remarks: this.campaignForm.get('remarks')?.value || '',
        createdBy: userId,
        updatedBy: userId,
      };

      this.operationsService.updateAdCampaignItem(payload).subscribe({
        next: (response) => {
          this.openAlertDialog('Success', 'Ad Campaign saved Successfully!');
          console.log('API Response:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.openAlertDialog('Error', error || 'Unexpected response. Please try again.');
          console.error('API Error:', error);
        },
      });
    }
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
