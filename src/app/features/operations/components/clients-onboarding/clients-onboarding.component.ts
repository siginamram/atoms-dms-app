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
  showSpinner: boolean = false;
  promotionTypes = [
    { value: 1, text: 'Branding' },
    { value: 2, text: 'Educational' },
    { value: 3, text: 'Meme' },
    
  ];
  
  creativeTypes = [
    { value: 1, text: 'Poster' },
    { value: 2, text: 'Graphic Reel' },
  ];

  creativeTypes1 = [
    { value: 3, text: 'YouTube' },
    { value: 4, text: 'Educational' },
  ];
  
  language = [
    { value: 2, text: 'Telugu' },
    { value: 1, text: 'English' },
  ];

  dayNames = [
    { value: 1, text: 'Sunday' },
    { value: 2, text: 'Monday' },
    { value: 3, text: 'Tuesday' },
    { value: 4, text: 'Wednesday' },
    { value: 5, text: 'Thursday' },
    { value: 6, text: 'Friday' },
    { value: 7, text: 'Saturday' },
  
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
      teamLeader: [null, Validators.required],
      contentWriter: [null, Validators.required],
      posterDesigner: [null, Validators.required],
      photographer: [null, Validators.required],
      videoEditor1: [null, Validators.required],
      videoEditor2: [null, Validators.required],
      dma: [null, Validators.required],
      loginCredentials: ['', Validators.required],
      posterDesigns: [''],
      graphicReels: [''],
      educationalReels: [''],
      youtubeVideos: [''],
      shootOffer: [''],
      moveTostatus: [''],
      lastDateOfService: [''],
      deliverables: this.fb.array([]),
      videodeliverables: this.fb.array([]),
      prioritydeliverables: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    if (this.clientId) {
      this.showSpinner = true;
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
        this.showSpinner = false;
        this.onboardingForm.patchValue({
          clientName: data.organizationName,
          dealClosingDate: data.createdAt,
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
          posterDesigns: data.package.noOfPosters,
          graphicReels: data.package.noOfGraphicReels,
          educationalReels: data.package.noOfEducationalReels,
          youtubeVideos: data.package.noOfYouTubeVideos,
          shootOffer: data.package.shootOffered ? 1 : 0,
          moveTostatus: data.status,
          lastDateOfService: this.formatDate(data.paymentDate),
        });

        data.clientDeliverables.forEach((deliverable: any) => {
          this.addDeliverable(deliverable);
        });

        data.clientVideoDeliverables.forEach((videodeliverable: any) => {
          this.addVideoDeliverable(videodeliverable);
        });

        data.clientDeliverablesPriorities.forEach((prioritydeliverables: any) => {
          this.addprioritydeliverables(prioritydeliverables);
        });

        console.log('Loaded Client Data:', this.onboardingForm.value);
      },
      error: (error) => {
        console.error('Failed to load client data:', error);
        this.showSpinner = false;
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

  addVideoDeliverable(videodeliverable: any = {  creativeType: '' , priority1:'' , priority2:'', priority3:'', priority4:'' , priority5:'', priority6:''}) {
    const newRow = this.fb.group({
      creativeType: [videodeliverable.creativeType, Validators.required],
      priority1:[videodeliverable.priority1,Validators.required],
      priority2:[videodeliverable.priority2,Validators.required],
      priority3:[videodeliverable.priority3,Validators.required],
      priority4:[videodeliverable.priority4,Validators.required],
      priority5:[videodeliverable.priority5,Validators.required],
      priority6:[videodeliverable.priority6,Validators.required],
    });
    this.videodeliverablesArray.push(newRow);
  }

  get videodeliverablesArray(): FormArray<FormGroup> {
    return this.onboardingForm.get('videodeliverables') as FormArray<FormGroup>;
  }

  removeVideoDeliverable(index: number): void {
    if (index >= 0 && index < this.videodeliverablesArray.length) {
      this.videodeliverablesArray.removeAt(index);
      console.log('Deliverable Removed:', this.videodeliverablesArray.value);
    }
  }

  addprioritydeliverables(prioritydeliverables: any = {  creativeType: '',promotionType:'' , priority1:'' , priority2:'', priority3:'', priority4:'' , priority5:'', priority6:''}) {
    const newRow = this.fb.group({
      creativeType: [prioritydeliverables.creativeType, Validators.required],
      promotionType: [prioritydeliverables.promotionType, Validators.required],
      priority1:[prioritydeliverables.priority1,Validators.required],
      priority2:[prioritydeliverables.priority2,Validators.required],
      priority3:[prioritydeliverables.priority3,Validators.required],
      priority4:[prioritydeliverables.priority4,Validators.required],
      priority5:[prioritydeliverables.priority5,Validators.required],
      priority6:[prioritydeliverables.priority6,Validators.required],
    });
    this.prioritydeliverablesArray.push(newRow);
  }

  get prioritydeliverablesArray(): FormArray<FormGroup> {
    return this.onboardingForm.get('prioritydeliverables') as FormArray<FormGroup>;
  }

  removeprioritydeliverables(index: number): void {
    if (index >= 0 && index < this.prioritydeliverablesArray.length) {
      this.prioritydeliverablesArray.removeAt(index);
      console.log('Deliverable Removed:', this.prioritydeliverablesArray.value);
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
            this.showSpinner = false;
            this.openAlertDialog('Success', 'Client Updated Successfully!');
            this.Router.navigate(['/home/operations/clients-list']);
          } else {
            this.showSpinner = false;
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
          }
        },
        error: (error: any) => {
          console.error('Update Error:', error);
          this.showSpinner = false;
          // Handle error scenarios with fallback message
          const errorMessage =
          error.error || 'Deliverable count is mismatch with client package.';
          this.openAlertDialog('Error', errorMessage);
        },
      });
    } else {
      this.showSpinner = false;
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }
  

  private preparePayload(): any {
    const formValue = this.onboardingForm.value;
    this.showSpinner = true;
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
      clientVideoDeliverables: this.videodeliverablesArray.value.map((deliverable: any) => ({
        creativeType: deliverable.creativeType,
        priority1:deliverable.priority1,
        priority2:deliverable.priority2,
        priority3:deliverable.priority3,
        priority4:deliverable.priority4,
        priority5:deliverable.priority5,
        priority6:deliverable.priority6,

      })),
      clientDeliverablesPriorities: this.prioritydeliverablesArray.value.map((deliverable: any) => ({
        creativeType: deliverable.creativeType,
        promotionType: deliverable.promotionType,
        priority1:deliverable.priority1,
        priority2:deliverable.priority2,
        priority3:deliverable.priority3,
        priority4:deliverable.priority4,
        priority5:deliverable.priority5,
        priority6:deliverable.priority6,

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

  onCancel(): void {
    // Logic for cancel action, such as navigating back or resetting the form
    this.Router.navigate(['/home/operations/clients-list']); // Example: Redirect to a specific route
  }
  
}
