import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { map, Observable, startWith } from 'rxjs';
export interface Employee {
  employeeid: number;
  userid: number;
  empname: string;
}
interface Client {
  organizationName: string;
  address?: string;
  gstNumber?: string;
  stateCode?: string;
}
@Component({
  selector: 'app-additional-task-add',
  standalone: false,
  templateUrl: './additional-task-add.component.html',
  styleUrls: ['./additional-task-add.component.css']
})
export class AdditionalTaskAddComponent implements OnInit {
  taskForm!: FormGroup;
  creativeTypes = ['Logo', 'Brochure', 'PPT', 'Templates', 'Flyers', 'Graphic Video', 'General Video', 'Podcast', 'Posters', 'Flexi'];
  existingClientControl = new FormControl<Client | string | null>(null);
  clients: Client[] = [];
  filteredClients!: Observable<Client[]>;
   userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  approvalUsersList: { userID: number; empname: string }[] = [];
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
  constructor(private fb: FormBuilder, 
            private router: Router,
      private operationsService: OperationsService,) {}

  ngOnInit(): void {
        this.loadDropdownOptions();
    this.loadApprovalsDropdownOptions();
    this.taskForm = this.fb.group({
      clientType: ['new', Validators.required],
      clientName: ['', Validators.required],
      creativeType: ['', Validators.required],
      deadline: ['', Validators.required],
      task: ['', Validators.required],
      contentApprovals: [''],
      postersApprovals: [''], 
      generalVideoApprovals: [''],
      contentWriter: [''],
      posterDesigner: [''],
      videoEditor1: [''],
      referenceLink: ['']
    });

        this.fetchAllClients();
    
      this.filteredClients = this.existingClientControl.valueChanges.pipe(startWith(''),
 map((value: Client | string | null) => {
        const name = typeof value === 'string' ? value : value?.organizationName || '';
        return this.filterClients(name);
      })
    );
  }
  
  get clientType(): 'existing' | 'new' {
    return this.taskForm.get('clientType')?.value;
  }

  fetchAllClients(): void {
    this.operationsService.getClientsByUser(this.userId).subscribe({
      next: (response: Client[]) => {
        this.clients = response;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  filterClients(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client =>
      client.organizationName.toLowerCase().includes(filterValue)
    );
  }

 displayFn(client: Client | string | null): string {
  return typeof client === 'object' && client !== null ? client.organizationName : client || '';
}


  onClientSelected(client: Client | null): void {
    if (client && typeof client === 'object') {
      this.taskForm.patchValue({
        clientName: client.organizationName,
        clientAddress: client.address || '',
        clientGST: client.gstNumber || '',
        gstStateCode: client.stateCode || ''
      });
    }
  }


loadApprovalsDropdownOptions(){
    this.operationsService.getAllEmployeesList().subscribe({
      next: (data: any[]) => {
        this.approvalUsersList = data.map(emp => ({
          userID: emp.userID,
          empname: `${emp.firstName} ${emp.lastName}`,
        }));
      },
      error: (error) => {
        console.error('Failed to load approval users list:', error);
      }
    });
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
  submitTask() {
    if (this.taskForm.valid) {
      console.log('Task Submitted:', this.taskForm.value);
    }
  }

  cancel() {
    this.router.navigate(['/home/operations/additional-task-view']);
  }

  goBack() {
    this.router.navigate(['/home/operations/additional-task-view']);
  }
    clearContentWriter(){
    this.taskForm.patchValue({
      contentWriter : null
    })
  }

  clearPosterDesigner(){
    this.taskForm.patchValue({
      posterDesigner : null
    })
  }



  clearVideoEditor1(){
    this.taskForm.patchValue({
      videoEditor1 : null
    })
  }

}