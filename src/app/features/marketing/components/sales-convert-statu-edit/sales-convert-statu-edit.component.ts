import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-sales-convert-statu-edit',
  standalone:false,
  templateUrl: './sales-convert-statu-edit.component.html',
  styleUrls: ['./sales-convert-statu-edit.component.css'],
})
export class SalesConvertStatuEditComponent implements OnInit {
  progressForm!: FormGroup;
  clientId: number = 0;
  uploadedSLAFile: File | null = null;
  operationsManagers: any[] = [];
  operationsLeads: any[] = [];
  maxDateForKt: Date;
  maxDate: Date; // Maximum date for the datepicker
  showSpinner: boolean = false;
  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.maxDate = new Date(); // Set maxDate to today's date
    this.maxDateForKt = new Date();
  }

  ngOnInit() {
    this.showSpinner = true;
    // Retrieve clientId from query parameters
    this.route.queryParams.subscribe((params) => {
      this.clientId = +params['clientid'] || 0;
      if (this.clientId > 0) {
        this.loadClientData(this.clientId); // Fetch data if clientId exists
      }
    });

    this.initializeForm();
    this.loadOperationsManagers(); // Load managers initially
    this.loadOperationsLeads(); // Load leads initially
    this.showSpinner = false;
  }

  loadClientData(clientId: number) {
    this.marketingService.GetclientKTStatusByClientId(clientId).subscribe(
      (data) => {
        if (data) {
          console.log('Fetched Client Data:', data);
  
          this.progressForm.patchValue({
            clientName: data.organizationName || '',
            clientCategory: data.clientCategory || '',
            operationsManager: data.opManagerID || '', // Bind opManagerID
            operationsLead: data.opLeadID || '', // Bind opLeadID
            contactNumberManager: data.opManagerNumber || '', // Bind opManagerNumber directly
            contactNumberLead: data.opLeadNumber || '', // Bind opLeadNumber directly
            ktStatus: data.isKTCompleted ? 1 : 0,
            ktDate:
              data.ktDate &&
              data.ktDate !== '0001-01-01T00:00:00' &&
              !isNaN(new Date(data.ktDate).getTime())
                ? new Date(data.ktDate)
                : '',
            isAdvReceived: data.isAdvReceived ? 1 : 0,
            advAmount: data.advAmount || 0,
            advanceDate:
              data.advDate &&
              data.advDate !== '0001-01-01T00:00:00' &&
              !isNaN(new Date(data.advDate).getTime())
                ? new Date(data.advDate)
                : '',
            slaUpload: data.slaUrl || null,
          });
          if(!data.isKTCompleted){
            this.maxDateForKt = new Date('12-31-2999');
          }
          // Optional: Log data for debugging
          console.log('Manager Contact:', data.opManagerNumber);
          console.log('Lead Contact:', data.opLeadNumber);
        }
      },
      (error) => {
        console.error('Failed to load client data:', error);
      }
    );
  }
  

  initializeForm() {
    this.progressForm = this.fb.group({
      clientName: [{value: '',disabled: true}, Validators.required ],
      clientCategory: ['', Validators.required],
      operationsManager: ['', Validators.required],
      operationsLead: ['', Validators.required],
      contactNumberManager: [{value: '',disabled: true}], // Optional fields without validation
      contactNumberLead: [{value: '',disabled: true}],
      ktStatus: [false, Validators.required],
      ktDate: ['', Validators.required],
      isAdvReceived: [false, Validators.required],
      advAmount: [0],
      advanceDate: [''],
      slaUpload: [null],
    });

    this.progressForm.get('operationsManager')?.valueChanges.subscribe((managerUserId) => {
      if (managerUserId) {
        this.setManagerContact(managerUserId);
      } else {
        this.clearManagerFields();
      }
    });

    this.progressForm.get('operationsLead')?.valueChanges.subscribe((leadUserId) => {
      if (leadUserId) {
        this.setLeadContact(leadUserId);
      } else {
        this.clearLeadFields();
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedSLAFile = input.files[0];
      console.log('Uploaded SLA File:', this.uploadedSLAFile.name);
    } else {
      this.uploadedSLAFile = null;
      console.log('No file selected');
    }
  }

  loadOperationsManagers() {
    this.marketingService.getemployeesByRoleID(2).subscribe(
      (data: any[]) => {
        this.operationsManagers = data || [];
      },
      (error) => {
        console.error('Failed to load managers:', error);
        this.operationsManagers = [];
      }
    );
  }

  loadOperationsLeads() {
    this.marketingService.getemployeesByRoleID(3).subscribe(
      (data: any[]) => {
        this.operationsLeads = data || [];
      },
      (error) => {
        console.error('Failed to load leads:', error);
        this.operationsLeads = [];
      }
    );
  }

  setManagerContact(managerUserId: number) {
    const manager = this.operationsManagers.find((m) => m.userId === managerUserId);
    this.progressForm.patchValue({ contactNumberManager: manager?.primaryContactNumber || '' });
  }
  
  setLeadContact(leadUserId: number) {
    const lead = this.operationsLeads.find((l) => l.userId === leadUserId);
    this.progressForm.patchValue({ contactNumberLead: lead?.primaryContactNumber || '' });
  }
  

  clearManagerFields() {
    this.progressForm.patchValue({
      contactNumberManager: '',
    });
  }

  clearLeadFields() {
    this.progressForm.patchValue({ contactNumberLead: '' });
  }

  onSubmit(): void {
    this.showSpinner = true
    if (this.progressForm.valid) {
      const payload = {
        clientId: this.clientId,
        opManagerID: this.progressForm.value.operationsManager, // Use userId for manager
        opLeadID: this.progressForm.value.operationsLead, // Use userId for lead
        opManagerNumber: this.progressForm.value.contactNumberManager,
        opLeadNumber: this.progressForm.value.contactNumberLead,
        isKTCompleted: this.progressForm.value.ktStatus === 1,
        ktDate: this.progressForm.value.ktDate || null,
        isAdvReceived: this.progressForm.value.isAdvReceived === 1,
        advAmount: this.progressForm.value.advAmount,
        advDate: this.progressForm.value.advanceDate || null,
        clientCategory: parseInt(this.progressForm.value.clientCategory, 10),
        slaUrl: this.uploadedSLAFile ? this.uploadedSLAFile.name : '',
        updatedBy: parseInt(localStorage.getItem('UserID') || '0', 10),
      };

      console.log('Submitting Payload:', payload);

      this.marketingService.updateClientKTStatus(payload).subscribe(
        (response: string) => {
          console.log('API Response:', response);
          this.showSpinner = false;
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Updated successfully!');
            this.router.navigate(['/home/marketing/sales-converted']);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected server response.');
          }
        },
        (error: any) => {
          this.showSpinner = false;
          console.error('Submission Failed:', error);
          const errorMessage =
            error?.error?.message || 'An unexpected error occurred. Please try again.';
          this.openAlertDialog('Error', errorMessage);
        }
      );
    } else {
      this.showSpinner = false;
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
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

  changeStatusValue(event:any){
    if(event.value == 1){
      this.maxDateForKt = new Date();
    }else{
      this.maxDateForKt = new Date('12-31-2999');
    }
  }
}
