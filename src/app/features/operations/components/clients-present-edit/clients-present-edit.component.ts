import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  templateUrl: './clients-present-edit.component.html',
  styleUrls: ['./clients-present-edit.component.css'],
})
export class ClientsPresentEditComponent implements OnInit{
  editForm: FormGroup;
  clientId!: number;
  userId = +localStorage.getItem('UserID')!
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
      dealClosingDate: ['', Validators.required],
      domain: ['', Validators.required],
      category: ['', Validators.required],
      teamLeader: ['', Validators.required],
      contentWriter: ['', Validators.required],
      photographer: ['', Validators.required],
      posterDesigner: ['', Validators.required],
      videoEditor1: ['', Validators.required],
      videoEditor2: ['', Validators.required],
      dma: ['', Validators.required],
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
      pocName: ['',Validators.required],
      pocDesignation: ['',Validators.required],
      contactNumber:['',Validators.required],
      moveToExit: [''],
      lastDateOfService: [''],
      pendingAmountExist: [''],
      pendingAmount: [''],
    });
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    if (this.clientId) {
      this.loadClientData(this.clientId);
    }
  }

  loadClientData(clientId: number) {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (data: any) => {
        this.editForm.patchValue({
          clientName: data.clientName || data.organizationName,
          dealClosingDate: this.formatDate(data.serviceStartDate),
          domain: data.domain,
          category: data.clientCategory,
          teamLeader: data.clientResourceAllocation.opLeadID,
          contentWriter: data.clientResourceAllocation.opContentWriterID,
          photographer: data.clientResourceAllocation.opPhotographerID,
          posterDesigner: data.clientResourceAllocation.opGraphicDesignerID,
          videoEditor1: data.clientResourceAllocation.opVideoEditor1ID,
          videoEditor2: data.clientResourceAllocation.opVideoEditor2ID,
          dma: data.clientResourceAllocation.opDMAID,
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
          pocName: data.pocName,
          pocDesignation: data.pocDesignation,
          contactNumber: data.pocContact,
          moveToExit: data.status === 3 ? 3 : null,
          lastDateOfService: this.formatDate(data.serviceEndDate),
          pendingAmountExist: data.isPendingAmount ? 1 : 0,
          pendingAmount: data.pendingAmount,
        });
  
        console.log('Client Data Loaded:', this.editForm.value);
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
onSubmit() {
  if (this.editForm.valid) {
    const formValue = this.editForm.value;

    const payload = {
      clientID: this.clientId,
      //clientName: formValue.clientName,
     // organizationName: formValue.clientName,
      //domain: formValue.domain,
      clientCategory: formValue.category,
      serviceStartDate: formValue.dealClosingDate,
      paymentDate:formValue.paymentRenewalDate,
      status: formValue.moveToExit || 2, // Default to "present" status
      pocName: formValue.pocName,
      pocDesignation: formValue.pocDesignation,
      pocContact: formValue.contactNumber,
      loginCredentials: formValue.loginCredentials === 1,
      pendingAmount: formValue.pendingAmount,
      isPendingAmount: formValue.pendingAmountExist === 1,
      serviceEndDate: formValue.lastDateOfService,
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
    };

    this.operationsService.UpdatePresentClient(payload).subscribe({
      next: (response) => {
        this.openAlertDialog('Success', 'Client Updated Successfully!');
          this.Router.navigate(['/home/operations/clients-list']);
      },
      error: (error) => {
        this.openAlertDialog('Error', 'Failed to Client Updated details. Please try again.');
      },
    });
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
