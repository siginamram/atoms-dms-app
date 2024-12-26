import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
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
  minDate: Date; // Variable to store today's date
  opManager:any;
  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private route: ActivatedRoute,
    private Router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.minDate = new Date(); // Set minDate to today's date
  }

  ngOnInit() {
    // Retrieve clientId from query parameters
    this.route.queryParams.subscribe((params) => {
      this.clientId = +params['clientid'] || 0;
  
      if (this.clientId > 0) {
        this.loadClientData(this.clientId); // Fetch data if clientId exists
      }
    });
  
    this.initializeForm();
    this.loadOperationsManagers(); // Load managers initially
  }
  
  loadClientData(clientId: number) {
    this.marketingService.GetclientKTStatusByClientId(clientId).subscribe(
      (data) => {
        if (data) {
          this.progressForm.patchValue({
            clientCategory: data.clientCategory || '',
            operationsManager: data.opManagerID || '',
            operationsLead: data.opLeadID || '',
            contactNumberManager: data.opManagerNumber || '',
            contactNumberLead: data.opLeadNumber || '',
            ktStatus: data.isKTCompleted ? 1 : 0,
            ktDate: data.ktDate ? new Date(data.ktDate) : '',
            isAdvReceived: data.isAdvReceived ? 1 : 0,
            advAmount: data.advAmount || 0,
            advanceDate: data.advDate ? new Date(data.advDate) : '',
            slaUpload: data.slaUrl || null,
          });
  
          // Optionally load dependent data if needed
          if (data.opManagerID) {
            this.loadOperationsLeads(data.opManagerID);
          }
        }
      },
      (error) => {
        console.error('Failed to load client data:', error);
      }
    );
  }

  initializeForm() {
    this.progressForm = this.fb.group({
      clientCategory: ['', Validators.required],
      operationsManager: ['', Validators.required],
      operationsLead: ['', Validators.required],
      contactNumberManager: [''], // Optional fields without validation
      contactNumberLead: [''],
      ktStatus: [false, Validators.required],
      ktDate: ['', Validators.required],
      isAdvReceived: [false, Validators.required],
      advAmount: [0],
      advanceDate: [''],
      slaUpload: [null],
    });

    this.progressForm.get('operationsManager')?.valueChanges.subscribe((managerEmployeeId) => {
      if (managerEmployeeId) {
        this.loadOperationsLeads(managerEmployeeId);
        this.setManagerContact(managerEmployeeId);
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
    this.marketingService.managerlistByRoleID(2).subscribe(
      (data: any[]) => {
        this.operationsManagers = data || [];
      },
      (error) => {
        console.error('Failed to load managers:', error);
        this.operationsManagers = [];
      }
    );
  }

  loadOperationsLeads(managerEmployeeId: number) {
    this.marketingService.teamleadByManager(managerEmployeeId, 3).subscribe(
      (data: any[]) => {
        this.operationsLeads = data || [];
      },
      (error) => {
        console.error('Failed to load leads:', error);
        this.operationsLeads = [];
      }
    );
  }

  setManagerContact(managerEmployeeId: number) {
    const manager = this.operationsManagers.find((m) => m.employeeId === managerEmployeeId);
    if (manager) {
      this.opManager=manager.userId;
      console.log('manager',this.opManager);
      this.progressForm.patchValue({ contactNumberManager: manager.primaryContactNumber });
    } else {
      this.clearManagerFields();
    }
  }

  setLeadContact(leadUserId: number) {
    const lead = this.operationsLeads.find((l) => l.userId === leadUserId);
    if (lead) {
      this.progressForm.patchValue({ contactNumberLead: lead.primaryContactNumber });
    } else {
      this.clearLeadFields();
    }
  }

  clearManagerFields() {
    this.progressForm.patchValue({
      contactNumberManager: '',
      operationsLead: '',
      contactNumberLead: '',
    });
    this.operationsLeads = [];
  }

  clearLeadFields() {
    this.progressForm.patchValue({ contactNumberLead: '' });
  }

  // Submit form data to the API
  onSubmit(): void {
    if (this.progressForm.valid) {
      const payload = {
        clientId: this.clientId,
        opManagerID: this.opManager, // Operational Manager ID
        opLeadID: this.progressForm.value.operationsLead,
        isKTCompleted: this.progressForm.value.ktStatus === 1,
        ktDate: this.progressForm.value.ktDate,
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
  
          // Handle plain text responses like "Success"
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Updated successfully!');
            this.Router.navigate(['/home/marketing/sales-converted']);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected server response.');
          }
        },
        (error: any) => {
          console.error('Submission Failed:', error);
  
          // Handle potential HTTP errors
          const errorMessage =
            error?.error?.message || 'An unexpected error occurred. Please try again.';
          this.openAlertDialog('Error', errorMessage);
        }
      );
    } else {
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
}
