import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-lead-management-edit',
  standalone:false,
  templateUrl: './lead-management-edit.component.html',
  styleUrls: ['./lead-management-edit.component.css'],
})
export class LeadManagementEditComponent {
  leadForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<LeadManagementEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commanApiService: MarketingService
  ) {
    // Initialize the form with the status field only
    this.leadForm = this.fb.group({
      status: [data.lead.status, Validators.required], // Populate with current status
    });
  }

  // Update lead status
  updateStatus(): void {
    if (this.leadForm.valid) {
      this.loading = true;
  
      const payload = {
        leadID: this.data.lead?.leadID, // Lead ID
        salesPersonID: parseInt(localStorage.getItem('UserID') || '0', 10), // UserID from localStorage
        status: parseInt(this.leadForm.value.status), // New status from dropdown
      };
  
      console.log('Payload:', payload);
  
      this.commanApiService.updateLeadStatus(payload).subscribe(
        (response: string) => {
          console.log('API Response:', response); // Should log "Success"
          this.loading = false;
          alert('Status updated successfully!');
          this.dialogRef.close('updated'); // Close the dialog
        },
        (error) => {
          this.loading = false;
          console.error('Failed to update status:', error);
          alert('Failed to update status. Please try again.');
        }
      );
    } else {
      alert('Please select a status.');
    }
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }
}
