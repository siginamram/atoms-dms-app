import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';

// Move the interface outside the component class
export interface Employee {
  employeeid: number;
  userid: number;
  empname: string;
}

@Component({
  selector: 'app-clients-onboarding',
  templateUrl: './clients-onboarding.component.html',
  styleUrls: ['./clients-onboarding.component.css'],
})
export class ClientsOnboardingComponent implements OnInit {
  onboardingForm: FormGroup;

  // Dropdown options for promotion types and creative types
  promotionTypes = ['Branding', 'Educational', 'Meme', 'Product Launch'];
  creativeTypes = ['Poster', 'Graphic Reel', 'Video'];

  // Min date set to today's date
  minDate: Date;
  uploadedSLAFile: File | null = null;
  // Dropdown options for employee roles
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
    private router: Router,
    private cdr: ChangeDetectorRef,
    private operationsService: OperationsService
  ) {
    this.minDate = new Date(); // Set minDate to today's date
    this.onboardingForm = this.fb.group({
      clientName: ['', Validators.required],
      dealClosingDate: ['', Validators.required],
      domain: ['', Validators.required],
      category: ['', Validators.required],
      ktStatus: [''],
      ktDate: [''],
      KtDocUpload: [null],
      isAdvReceived: [''],
      advAmount: [''],
      advanceDate: [''],
      teamLeader: [''],
      contentWriter: [''],
      photographer: [''],
      posterDesigner: [''],
      videoEditor1: [''],
      videoEditor2: [''],
      dma: [''],
      loginCredentials: ['', Validators.required],
      paymentRenewalDate: [''],
      remarks: [''],
      moveTostatus: [''],
      lastDateOfService: [''],
      deliverables: this.fb.array([]), // Initialize FormArray
    });
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
  }

  // Load dropdown options
  loadDropdownOptions() {
    this.fetchRoleData(3, 'teamLeader');
    this.fetchRoleData(10, 'contentWriters');
    this.fetchRoleData(11, 'posterDesigners');
    this.fetchRoleData(12, 'videoEditors');
    this.fetchRoleData(9, 'dmas');
    this.fetchRoleData(13, 'photographers');
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
  // Fetch role data from the service and map to Employee[]
  fetchRoleData(roleId: number, key: keyof typeof this.dropdownOptions): void {
    this.operationsService.getemployeesByRoleID(roleId).subscribe({
      next: (data: any[]) => {
        this.dropdownOptions[key] = data.map((item) => ({
          employeeid: item.employeeId,
          empname: item.empName,
        })) as Employee[];
        console.log(`Dropdown Options for ${key}:`, this.dropdownOptions[key]);
      },
      error: (error) => {
        console.error(`Failed to fetch data for role ${roleId}:`, error);
      },
    });
  }
  

  // Getter for FormArray
  get deliverablesArray(): FormArray<FormGroup> {
    return this.onboardingForm.get('deliverables') as FormArray<FormGroup>;
  }
  
  // Add a new deliverable row
  addDeliverable() {
    const newRow = this.fb.group({
      type: ['', Validators.required],
      telugu: ['', Validators.required],
      english: ['', Validators.required],
      creativeType: ['', Validators.required],
    });
    this.deliverablesArray.push(newRow);
    console.log('Deliverable Added:', this.deliverablesArray.value);
  }

  // Remove a deliverable row
  removeDeliverable(index: number) {
    if (index >= 0 && index < this.deliverablesArray.length) {
      this.deliverablesArray.removeAt(index);
      console.log('Deliverable Removed:', this.deliverablesArray.value);
    }
  }

  // Submit form
  onSubmit() {
    if (this.onboardingForm.valid) {
      console.log('Form Data:', this.onboardingForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
