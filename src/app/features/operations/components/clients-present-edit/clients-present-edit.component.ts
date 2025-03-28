import { Component , OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

// Move the interface outside the component class
export interface Employee {
  employeeid: number;
  empname: string;
  userId:number;
}

@Component({
  selector: 'app-clients-present-edit',
  standalone:false,
  templateUrl: './clients-present-edit.component.html',
  styleUrls: ['./clients-present-edit.component.css'],
})
export class ClientsPresentEditComponent implements OnInit{
  editForm: FormGroup;
  showSpinner: boolean = false;
  clientId!: number;
  showPdfMessage: boolean = false;
  organizationName:string='';
  userId = +localStorage.getItem('UserID')!
  promotionTypes = [
    { value: 1, text: 'Branding' },
    { value: 2, text: 'Educational' },
    { value: 3, text: 'Meme' },
    
  ];
  KtDocUpload: { fileName: string; fileBytes: any } = {
    fileName: '',
    fileBytes: null
  };
  ktUrl: string = ''
  
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
    // Dropdown options for employee roles
    dropdownOptions: Record<
      'teamLeaders' | 'contentWriters' | 'posterDesigners' | 'videoEditors' | 'dmas' | 'photographers' ,
      Employee[]
    > = {
      teamLeaders: [],
      contentWriters: [],
      posterDesigners: [],
      videoEditors: [],
      dmas: [],
      photographers: [],
      
    };

  constructor(private fb: FormBuilder,
    private operationsService: OperationsService,
    private Router: Router,
    private dialog: MatDialog ,// Inject MatDialog
     private route: ActivatedRoute,) 
     {
    this.editForm = this.fb.group({
      clientName: ['', Validators.required],
      dealClosingDate: [''],
      domain: ['', Validators.required],
      category: ['', Validators.required],
      teamLeader: ['', Validators.required],
      contentWriter: [''],
      photographer: [''],
      posterDesigner: [''],
      videoEditor1: [''],
      videoEditor2: [''],
      dma: [''],
      loginCredentials: ['', Validators.required],
      paymentRenewalDate: ['' , Validators.required],
      // Package Section
      basePackage: ['', Validators.required],
      posterDesigns: ['', Validators.required],
      graphicReels: ['', Validators.required],
      educationalReels: ['', Validators.required],
      youtubeVideos: ['', Validators.required],
      shootOffer: ['', Validators.required],
      shootBudget: ['', Validators.required],
      monthlyAdBudget: [''],
      chargePerVist:[''],
      duedate:['', Validators.required],
      includeAdBudget:[false],
      isGSTApplicable:[false],
      gstnumber:[''],
      stateCode:[0],
      pocName: ['',Validators.required],
      pocDesignation: ['',Validators.required],
      contactNumber:['',Validators.required],
      moveToExit: [''],
      lastDateOfService: [''],
      pendingAmountExist: [''],
      pendingAmount: [''],
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

  loadClientData(clientId: number) {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (data: any) => {
        this.showSpinner = false;
        this.organizationName=data.organizationName;
        this.ktUrl = data.ktDocUrl;
        this.editForm.patchValue({
          clientName: data.clientName || data.organizationName,
          dealClosingDate: data.createdAt,
          domain: data.domain,
          category: data.clientCategory,
          teamLeader: data.clientResourceAllocation?.opLeadID || null,
          contentWriter: data.clientResourceAllocation?.opContentWriterID ,
          photographer: data.clientResourceAllocation?.opPhotographerID ,
          posterDesigner: data.clientResourceAllocation?.opGraphicDesignerID ,
          videoEditor1: data.clientResourceAllocation?.opVideoEditor1ID ,
          videoEditor2: data.clientResourceAllocation?.opVideoEditor2ID,
          dma: data.clientResourceAllocation?.opDMAID ,
          loginCredentials: data.loginCredentials ? 1 : 0,
          paymentRenewalDate: this.formatDate(data.paymentDate),
          basePackage: data.package.basePackage,
          posterDesigns: data.package.noOfPosters,
          graphicReels: data.package.noOfGraphicReels,
          educationalReels: data.package.noOfEducationalReels,
          youtubeVideos: data.package.noOfYouTubeVideos,
          shootOffer: data.package.shootOffered ? 1 : 0,
          shootBudget: data.package.shootBudget ? 1 : 0,
          monthlyAdBudget: data.package.adBudget,
          chargePerVist: data.package.chargePerVisit,
          duedate:data.dueDate,
          includeAdBudget:data.package.isIncludeAdBudget || false,
          isGSTApplicable:data.package.isGSTApplicable || false,
          gstnumber:data.package.gstNumber || 0,
          stateCode:data.package.stateCode || 0,
          pocName: data.pocName,
          pocDesignation: data.pocDesignation,
          contactNumber: data.pocContact,
          moveToExit: data.status === 3 ? 3 : null,
          lastDateOfService: this.formatDate(data.serviceEndDate),
          pendingAmountExist: data.isPendingAmount ? 1 : 0,
          pendingAmount: data.pendingAmount,
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
        console.log('Client Data Loaded:', this.editForm.value);
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
  // Load dropdown options
  loadDropdownOptions() {
    this.fetchRoleData(3, 'teamLeaders');
    this.fetchRoleData(10, 'contentWriters');
    this.fetchRoleData(11, 'posterDesigners');
    this.fetchRoleData(12, 'videoEditors');
    this.fetchRoleData(9, 'dmas');
    this.fetchRoleData(13, 'photographers');
  }
 
  // Fetch role data from the service and map to Employee[]
  fetchRoleData(roleId: number, key: keyof typeof this.dropdownOptions): void {
    this.operationsService.getemployeesByRoleID(roleId).subscribe({
      next: (data: any[]) => {
        this.dropdownOptions[key] = data.map((item) => ({
          employeeid: item.employeeId,
          empname: item.empName,
          userId:item.userId,
        })) as Employee[];
        console.log(`Dropdown Options for ${key}:`, this.dropdownOptions[key]);
      },
      error: (error) => {
        console.error(`Failed to fetch data for role ${roleId}:`, error);
      },
    });
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
      return this.editForm.get('deliverables') as FormArray<FormGroup>;
    }
  
    removeDeliverable(index: number): void {
      if (index >= 0 && index < this.deliverablesArray.length) {
        this.deliverablesArray.removeAt(index);
        console.log('Deliverable Removed:', this.deliverablesArray.value);
      }
    }
  
    addVideoDeliverable(videodeliverable: any = {  creativeType: '' , priority1:'' , priority2:'', priority3:'', priority4:'' , priority5:'', priority6:'', priority7:''}) {
      const newRow = this.fb.group({
        creativeType: [videodeliverable.creativeType, Validators.required],
        priority1:[videodeliverable.priority1,Validators.required],
        priority2:[videodeliverable.priority2,Validators.required],
        priority3:[videodeliverable.priority3,Validators.required],
        priority4:[videodeliverable.priority4,Validators.required],
        priority5:[videodeliverable.priority5,Validators.required],
        priority6:[videodeliverable.priority6,Validators.required],
        priority7:[videodeliverable.priority7,Validators.required],
      });
      this.videodeliverablesArray.push(newRow);
    }
  
    get videodeliverablesArray(): FormArray<FormGroup> {
      return this.editForm.get('videodeliverables') as FormArray<FormGroup>;
    }
  
    // removeVideoDeliverable(index: number): void {
    //   if (index >= 0 && index < this.videodeliverablesArray.length) {
    //     this.videodeliverablesArray.removeAt(index);
    //     console.log('Deliverable Removed:', this.videodeliverablesArray.value);
    //   }
    // }
  
    addprioritydeliverables(prioritydeliverables: any = {  creativeType: '',promotionType:'' , priority1:'' , priority2:'', priority3:'', priority4:'' , priority5:'', priority6:'', priority7:''}) {
      const newRow = this.fb.group({
        creativeType: [prioritydeliverables.creativeType, Validators.required],
        promotionType: [prioritydeliverables.promotionType, Validators.required],
        priority1:[prioritydeliverables.priority1,Validators.required],
        priority2:[prioritydeliverables.priority2,Validators.required],
        priority3:[prioritydeliverables.priority3,Validators.required],
        priority4:[prioritydeliverables.priority4,Validators.required],
        priority5:[prioritydeliverables.priority5,Validators.required],
        priority6:[prioritydeliverables.priority6,Validators.required],
        priority7:[prioritydeliverables.priority7,Validators.required],
      });
      this.prioritydeliverablesArray.push(newRow);
    }
  
    get prioritydeliverablesArray(): FormArray<FormGroup> {
      return this.editForm.get('prioritydeliverables') as FormArray<FormGroup>;
    }
  
    removeprioritydeliverables(index: number): void {
      if (index >= 0 && index < this.prioritydeliverablesArray.length) {
        this.prioritydeliverablesArray.removeAt(index);
        console.log('Deliverable Removed:', this.prioritydeliverablesArray.value);
      }
    }

       // Utility function to format date as YYYY-MM-DD
       private formatDate1(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      this.showSpinner = true;
      const payload = {
        clientID: this.clientId,
        clientCategory: formValue.category,
        serviceStartDate: this.formatDate1(new Date(this.editForm.get('dealClosingDate')?.value || '')), 
        dueDate:this.formatDate1(new Date(this.editForm.get('duedate')?.value || '')),
        paymentDate: this.formatDate1(new Date(this.editForm.get('paymentRenewalDate')?.value || '')), 
        status: formValue.moveToExit || 2, // Default to "present" status
        pocName: formValue.pocName,
        pocDesignation: formValue.pocDesignation,
        pocContact: formValue.contactNumber,
        loginCredentials: formValue.loginCredentials === 1,
        pendingAmount: formValue.pendingAmount,
        isPendingAmount: formValue.pendingAmountExist === 1,
        serviceEndDate:  formValue.lastDateOfService,
        ktDocUrl: this.ktUrl,
        ktDocument: this.KtDocUpload,
        package: {
          clientID: this.clientId,
          basePackage: formValue.basePackage,
          adBudget: formValue.monthlyAdBudget,
          noOfPosters: formValue.posterDesigns,
          noOfGraphicReels: formValue.graphicReels,
          noOfEducationalReels: formValue.educationalReels,
          noOfYouTubeVideos: formValue.youtubeVideos,
          shootOffered: formValue.shootOffer === 1,
          shootBudget: formValue.shootBudget === 1,
          chargePerVisit: formValue.chargePerVist,
          isIncludeAdBudget:formValue.includeAdBudget,
          isGSTApplicable:formValue.isGSTApplicable,
          gstNumber:formValue.gstnumber,
          stateCode:formValue.stateCode,
        },
        clientResourceAllocation: {
          clientId: this.clientId,
          opLeadID: formValue.teamLeader,
          opContentWriterID: formValue.contentWriter,
          opGraphicDesignerID: formValue.posterDesigner,
          opVideoEditor1ID: formValue.videoEditor1,
          opVideoEditor2ID: formValue.videoEditor2,
          opDMAID: formValue.dma,
          opPhotographerID: formValue.photographer,
        },
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
          priority7:deliverable.priority7,
  
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
          priority7:deliverable.priority7,
  
        })),
      };
  
      this.operationsService.UpdatePresentClient(payload).subscribe({
        next: (response: any) => {
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
          const errorMessage =
            error?.error?.message || 'Deliverable count is mismatch with client package.';
          this.openAlertDialog('Error', errorMessage);
          this.showSpinner = false;
        },
      });
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
onCancel(): void {
  // Logic for cancel action, such as navigating back or resetting the form
  this.Router.navigate(['/home/operations/clients-list']); // Example: Redirect to a specific route
}
goBack(): void {
  this.Router.navigate(['/home/operations/clients-list']); 
}

onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    let type =  input.files[0]?.name.split('.').pop()
    let file = input.files[0];
    if(type == 'pdf' && file.size < 1024*1024*2) //2mb
    {
      this.showPdfMessage = false;
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (result) => {
        this.KtDocUpload.fileName = file.name;
        this.KtDocUpload.fileBytes = result.target ? result.target['result']?.toString().split(",")[1]: '';
      }
    }
    else{
      this.showPdfMessage = true
    }
  } else {
  }
}

clearContentWriter(){
  this.editForm.patchValue({
    contentWriter : null
  })
}

clearPosterDesigner(){
  this.editForm.patchValue({
    posterDesigner : null
  })
}

clearPhotographer(){
  this.editForm.patchValue({
    photographer : null
  })
}

clearVideoEditor1(){
  this.editForm.patchValue({
    videoEditor1 : null
  })
}

clearVideoEditor2(){
  this.editForm.patchValue({
    videoEditor2 : null
  })
}

clearDMA(){
  this.editForm.patchValue({
    dma : null
  })
}

}
