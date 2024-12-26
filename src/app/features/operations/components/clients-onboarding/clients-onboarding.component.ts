import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

export interface Employee {
  employeeid: number;
  userid: number;
  empname: string;
}

@Component({
  selector: 'app-clients-onboarding',
  standalone:false,
  templateUrl: './clients-onboarding.component.html',
  styleUrls: ['./clients-onboarding.component.css'],
})
export class ClientsOnboardingComponent implements OnInit {
  onboardingForm: FormGroup;
  promotionTypes = [
    { value: 1, text: 'Branding' },
    { value: 2, text: 'Educational' },
    { value: 3, text: 'Meme' },
    
  ];
  
  creativeTypes = [
    { value: 1, text: 'Poster' },
    { value: 2, text: 'Graphic Reel' },
    { value: 3, text: 'Video' },
  ];
  
  language = [
    { value: 2, text: 'Telugu' },
    { value: 1, text: 'English' },
  ];
  
  minDate: Date;
  KtDocUpload: File | null = null;
  clientId!: number;
  userId = +localStorage.getItem('UserID')!;

  dropdownOptions: Record<
    'teamLeader' | 'contentWriters' | 'posterDesigners' | 'videoEditors' | 'dmas' | 'photographers',
    Employee[]
  > = {
    teamLeader: [],
    contentWriters: [],
    posterDesigners: [],
    videoEditors: [],
    dmas: [],
    photographers: [],
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private operationsService: OperationsService,
    private Router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.minDate = new Date();
    this.onboardingForm = this.fb.group({
      clientName: ['', Validators.required],
      dealClosingDate: ['', Validators.required],
      domain: ['', Validators.required],
      category: ['', Validators.required],
      ktStatus: ['', Validators.required],
      ktDate: [''],
      KtDocUpload:[''],
      isAdvReceived: ['', Validators.required],
      advAmount: ['', Validators.required],
      advanceDate: ['', Validators.required],
      teamLeader: ['', Validators.required],
      contentWriter: ['', Validators.required],
      photographer: ['', Validators.required],
      posterDesigner: ['', Validators.required],
      videoEditor1: ['', Validators.required],
      videoEditor2: ['', Validators.required],
      dma: [''],
      loginCredentials: ['', Validators.required],
      moveTostatus: [''],
      lastDateOfService: [''],
      deliverables: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    if (this.clientId) {
      this.loadClientData(this.clientId);
    }
  }

  loadDropdownOptions() {
    this.fetchRoleData(3, 'teamLeader');
    this.fetchRoleData(10, 'contentWriters');
    this.fetchRoleData(11, 'posterDesigners');
    this.fetchRoleData(12, 'videoEditors');
    this.fetchRoleData(9, 'dmas');
    this.fetchRoleData(13, 'photographers');
  }

  fetchRoleData(roleId: number, key: keyof typeof this.dropdownOptions): void {
    this.operationsService.getemployeesByRoleID(roleId).subscribe({
      next: (data: any[]) => {
        this.dropdownOptions[key] = data.map((item) => ({
          employeeid: item.employeeId,
          empname: item.empName,
          userid: item.userId,
        }));
      },
      error: (error) => {
        console.error(`Failed to fetch data for role ${roleId}:`, error);
      },
    });
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.KtDocUpload = input.files[0];
      console.log('Uploaded SLA File:', this.KtDocUpload.name);
    } else {
      this.KtDocUpload = null;
      console.log('No file selected');
    }
  }
  
  loadClientData(clientId: number) {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (data: any) => {
        this.onboardingForm.patchValue({
          clientName: data.organizationName,
          dealClosingDate: this.formatDate(data.serviceStartDate),
          domain: data.domain,
          category: data.clientCategory,
          ktStatus: data.isKTCompleted ? 1 : 0,
          ktDate: this.formatDate(data.ktDate),
          isAdvReceived: data.isAdvReceived ? 1 : 0,
          advAmount: data.advAmount,
          advanceDate: this.formatDate(data.advDate),
          teamLeader: data.clientResourceAllocation.opLeadID,
          contentWriter: data.clientResourceAllocation.opContentWriterID,
          photographer: data.clientResourceAllocation.opPhotographerID,
          posterDesigner: data.clientResourceAllocation.opGraphicDesignerID,
          videoEditor1: data.clientResourceAllocation.opVideoEditor1ID,
          videoEditor2: data.clientResourceAllocation.opVideoEditor2ID,
          dma: data.clientResourceAllocation.opDMAID,
          loginCredentials: data.loginCredentials ? 1 : 0,
          moveTostatus: data.status,
          lastDateOfService: this.formatDate(data.paymentDate),
        });

        data.clientDeliverables.forEach((deliverable: any) => {
          this.addDeliverable(deliverable);
        });

        console.log('Loaded Client Data:', this.onboardingForm.value);
      },
      error: (error) => {
        console.error('Failed to load client data:', error);
      },
    });
  }

  private formatDate(date: string | null): string | null {
    if (!date || date === '0001-01-01T00:00:00') {
      return null;
    }
    return date;
  }

  addDeliverable(deliverable: any = { promotionType: '', creativeType: '', language: '', count: '' }) {
    const newRow = this.fb.group({
      promotionType: [deliverable.promotionType, Validators.required],
      creativeType: [deliverable.creativeType, Validators.required],
      language: [deliverable.language, Validators.required],
      count: [deliverable.count, Validators.required],
    });
    this.deliverablesArray.push(newRow);
  }

  get deliverablesArray(): FormArray<FormGroup> {
    return this.onboardingForm.get('deliverables') as FormArray<FormGroup>;
  }

  removeDeliverable(index: number): void {
    if (index >= 0 && index < this.deliverablesArray.length) {
      this.deliverablesArray.removeAt(index);
      console.log('Deliverable Removed:', this.deliverablesArray.value);
    }
  }

  onSubmit(): void {
    if (this.onboardingForm.valid) {
      const payload = this.preparePayload(); // Prepare payload from form data
  
      this.operationsService.UpdateOnboardClient(payload).subscribe({
        next: (response: any) => {
          console.log('Update Response:', response);
  
          // Check for success response (plain text)
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Client Updated Successfully!');
            this.Router.navigate(['/home/operations/clients-list']);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
          }
        },
        error: (error: any) => {
          console.error('Update Error:', error);
  
          // Handle error scenarios with fallback message
          const errorMessage =
            error?.error?.message || 'Failed to update client details. Please try again.';
          this.openAlertDialog('Error', errorMessage);
        },
      });
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }
  

  private preparePayload(): any {
    const formValue = this.onboardingForm.value;
    return {
      clientID: this.clientId,
      //clientName: formValue.clientName,
      //organizationName: formValue.clientName,
      //domain: formValue.domain,
      clientCategory: formValue.category,
      serviceStartDate: formValue.dealClosingDate,
      isKTCompleted: formValue.ktStatus === 1,
      ktDate: formValue.ktDate,
      ktDocUrl:'c:/file.jpg',
      status: formValue.moveTostatus || 1, // Default to 1 if not provided
      paymentDate:formValue.lastDateOfService,
      isAdvReceived: formValue.isAdvReceived === 1,
      advAmount: formValue.advAmount,
      advDate: formValue.advanceDate,
      loginCredentials: formValue.loginCredentials ===  1,
      clientDeliverables: this.deliverablesArray.value.map((deliverable: any) => ({
        promotionType: deliverable.promotionType,
        language:deliverable.language,
        count:deliverable.count,
        creativeType: deliverable.creativeType,

      })),
      clientResourceAllocation: {
        opLeadID: formValue.teamLeader,
        opContentWriterID: formValue.contentWriter,
        opGraphicDesignerID: formValue.posterDesigner,
        opVideoEditor1ID: formValue.videoEditor1,
        opVideoEditor2ID: formValue.videoEditor2,
        opDMAID: formValue.dma,
        opPhotographerID: formValue.photographer,
      },
      createdBy: this.userId,
    };
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
