import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../services/operations.service';
// Move the interface outside the component class
export interface Employee {
  employeeid: number;
  empname: string;
}

@Component({
  selector: 'app-clients-present-edit',
  templateUrl: './clients-present-edit.component.html',
  styleUrls: ['./clients-present-edit.component.css'],
})
export class ClientsPresentEditComponent implements OnInit{
  editForm: FormGroup;

    // Dropdown options for employee roles
    dropdownOptions: Record<
      'teamLeaders' | 'contentWriters' | 'posterDesigners' | 'videoEditors' | 'dmas' | 'photographers' | 'saname',
      Employee[]
    > = {
      teamLeaders: [],
      contentWriters: [],
      posterDesigners: [],
      videoEditors: [],
      dmas: [],
      photographers: [],
      saname:[],
    };

  constructor(private fb: FormBuilder,private operationsService: OperationsService) {
    this.editForm = this.fb.group({
      clientName: ['', Validators.required],
      dealClosingDate: ['', Validators.required],
      domain: ['', Validators.required],
      category: ['', Validators.required],
      saName: ['', Validators.required],
      saNumber: [''],
      teamLeader: [''],
      contentWriter: [''],
      photographer: [''],
      posterDesigner: [''],
      videoEditor1: [''],
      dma: [''],
      loginCredentials: ['', Validators.required],
      serviceRenewalDate: [''],
      paymentRenewalDate: [''],
      remarks: [''],
      // Package Section
      basePackage: [''],
      posterDesigns: [''],
      graphicReels: [''],
      educationalReels: [''],
      testimonials: [''],
      youtubeVideos: [''],
      shootOffer: [''],
      shootBudget: [''],
      teluguContentDays: [''],
      englishContentDays: [''],
      monthlyAdBudget: [''],
      pocName: [''],
      pocDesignation: [''],
      moveToExit: [''],
      lastDateOfService: [''],
      pendingAmountExist: [''],
      pendingAmount: [''],
    });
  }
  ngOnInit(): void {
    this.loadDropdownOptions();
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
      console.log('Form Data:', this.editForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
