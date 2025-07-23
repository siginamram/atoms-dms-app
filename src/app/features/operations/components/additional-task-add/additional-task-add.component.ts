import { Component, OnInit, Inject,Optional  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { map, Observable, startWith } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

export interface Employee {
  employeeid: number;
  userid: number;
  empname: string;
}

interface Client {
  clientId: number;
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
  isEditMode = false;
  taskId: number = 0;
  creativeTypes = ['Logo', 'Brochure', 'PPT', 'Templates', 'Flyers', 'Graphic Video', 'General Video', 'Podcast', 'Posters', 'Flexi'];
  creativeTypeMap: { [key: string]: number } = {
    'Logo': 1,
    'Brochure': 2,
    'PPT': 3,
    'Templates': 4,
    'Flyers': 5,
    'Graphic Video': 6,
    'General Video': 7,
    'Podcast': 8,
    'Posters': 9,
    'Flexi': 10
  };

  existingClientControl = new FormControl<Client | string | null>(null);
  clients: Client[] = [];
  filteredClients!: Observable<Client[]>;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  approvalUsersList: { userID: number; empname: string }[] = [];

  dropdownOptions: Record<'teamLeader' | 'contentWriters' | 'posterDesigners' | 'videoEditors' | 'dmas' | 'photographers', Employee[]> = {
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
  private dialog: MatDialog,
  private operationsService: OperationsService,
  @Optional() private dialogRef: MatDialogRef<AdditionalTaskAddComponent>,
  @Optional() @Inject(MAT_DIALOG_DATA) public editData: any
) {}

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.loadApprovalsDropdownOptions();
    this.buildForm();

    if (this.editData) {
      this.isEditMode = true;
      this.patchFormForEdit(this.editData);
    }

    this.fetchAllClients();
    this.filteredClients = this.existingClientControl.valueChanges.pipe(
      startWith(''),
      map((value: Client | string | null) => {
        const name = typeof value === 'string' ? value : value?.organizationName || '';
        return this.filterClients(name);
      })
    );
  }

  buildForm(): void {
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
      referenceLink: [
        '',
        [Validators.pattern( '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$')]
      ],
    });
  }

  patchFormForEdit(editData: any): void {
    this.taskId = editData.id || 0;
    this.taskForm.patchValue({
      clientType: editData.isExistingClient ? 'existing' : 'new',
      clientName: editData.organizationName,
      creativeType: this.creativeTypes[editData.creativeType - 1] || '',
      deadline: editData.deadline,
      task: editData.task,
      contentWriter: editData.contentWriter || '',
      posterDesigner: editData.designer || '',
      contentApprovals: editData.contentApprover || '',
      postersApprovals: editData.designApprover || '',
      referenceLink: editData.referenceLink || ''
    });

    if (editData.isExistingClient) {
      this.existingClientControl.setValue({
        clientId: editData.clientId,
        organizationName: editData.organizationName
      });
    }
  }
get clientType(): 'existing' | 'new' {
  return this.taskForm.get('clientType')?.value;
}
  fetchAllClients(): void {
    this.operationsService.getClientsByUser(this.userId).subscribe({
      next: (response: Client[]) => this.clients = response,
      error: (error) => console.error('Error fetching clients:', error)
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
      });
    }
  }

  loadApprovalsDropdownOptions(): void {
    this.operationsService.getAllEmployeesList().subscribe({
      next: (data: any[]) => {
        this.approvalUsersList = data.map(emp => ({
          userID: emp.userID,
          empname: `${emp.firstName} ${emp.lastName}`,
        }));
      },
      error: (error) => console.error('Failed to load approval users list:', error)
    });
  }

  loadDropdownOptions(): void {
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
      error: (error) => console.error(`Failed to fetch data for role ${roleId}:`, error),
    });
  }

  submitTask(): void {
    if (this.taskForm.invalid) return;

    const form = this.taskForm.value;
    const selectedClient = this.existingClientControl.value;

    const payload = {
      id: this.isEditMode ? this.taskId : 0,
      isExistingClient: form.clientType === 'existing',
      clientId: selectedClient && typeof selectedClient === 'object' ? selectedClient.clientId || 0 : 0,
      organizationName: form.clientName,
      task: form.task,
      referenceLink: form.referenceLink,
      creativeType: this.creativeTypeMap[form.creativeType] || 0,
      deadline: form.deadline,
      contentWriter: form.contentWriter || 0,
      contentApprover: form.contentApprovals || 0,
      designer: form.posterDesigner || 0,
      designApprover: form.postersApprovals || 0,
    };

    this.operationsService.AddAdditionalTask(payload).subscribe({
      next: () => {
        const message = this.isEditMode ? 'Updated Successfully!' : 'Data Saved Successfully!';
        this.openAlertDialog('Success', message);
        this.router.navigate(['/home/operations/additional-task-view']);
         this.dialogRef.close(true);
      },
      error: (error) => {
        this.openAlertDialog('Error', error?.error?.title || 'Failed to submit metadata');
        console.error('Submit error:', error);
      }
    });
  }

  cancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/home/operations/additional-task-view']);
    }
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }

  goBack(): void {
    this.router.navigate(['/home/operations/additional-task-view']);
  }

  clearContentWriter(): void {
    this.taskForm.patchValue({ contentWriter: null });
  }

  clearPosterDesigner(): void {
    this.taskForm.patchValue({ posterDesigner: null });
  }

  clearVideoEditor1(): void {
    this.taskForm.patchValue({ videoEditor1: null });
  }
}
