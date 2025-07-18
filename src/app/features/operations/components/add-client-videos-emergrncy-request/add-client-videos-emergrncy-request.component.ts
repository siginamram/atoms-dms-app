import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-client-videos-emergency-request',
  standalone: false,
  templateUrl: './add-client-videos-emergrncy-request.component.html',
  styleUrls: ['./add-client-videos-emergrncy-request.component.css']
})
export class AddClientVideosEmergrncyRequestComponent  implements OnInit {
  emergencyRequestForm: FormGroup;
  showSpinner: boolean = false;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientName: string = '';
  minDate: Date = new Date();
  creativeTypes = [
    { id: 3, name: 'Youtube Videos' },
    { id: 4, name: 'Educational Reels' },
  ];

  emergencyType = [
    { id: 1, name: 'Add' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private dialogRef: MatDialogRef<AddClientVideosEmergrncyRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.emergencyRequestForm = this.fb.group({
      clientId: [null, Validators.required],
      date: ['', Validators.required],
      creativeTypeId: ['', Validators.required],
      emergencyType: [1],
      cwInputsForVE: ['', Validators.required],
      cwInputsForVG: ['', Validators.required],
      shootLink: ['', [
        Validators.required,
        Validators.pattern(
            '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
          ),
      ]]
    });
  }

  ngOnInit(): void {
    this.fetchAllClients();
  }

  fetchAllClients(): void {
    this.operationsService.getClientsByUser(this.userId).subscribe({
      next: (response: any[]) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      },
    });
  }

  filterClients(event: Event): void {
    const input = event.target as HTMLInputElement;
    const search = input.value.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.organizationName.toLowerCase().includes(search)
    );
  }

  onClientSelected(event: any): void {
    const selectedOrg = event.option.value;
    const selectedClient = this.clients.find(client => client.organizationName === selectedOrg);
    if (selectedClient) {
      this.selectedClientName = selectedOrg;
      this.emergencyRequestForm.patchValue({ clientId: selectedClient.clientId });
    }
  }

  sendForApproval() {
    if (this.emergencyRequestForm.valid) {
      const payload = {
        ...this.emergencyRequestForm.value,
        date: this.formatDate(new Date(this.emergencyRequestForm.value.date)),
        createdBy: this.userId
      };
      this.showSpinner = true;
      this.operationsService.AddClientVideoEmergencyRequest(payload).subscribe({
        next: (res: string) => {
          this.showSpinner = false;
          if (res === 'Success') {
            this.openAlertDialog('Success', 'Request submitted successfully!');
            this.dialogRef.close(true);
          } else {
            this.openAlertDialog('Error', res || 'Submission failed.');
          }
        },
        error: (err) => {
          this.showSpinner = false;
          this.openAlertDialog('Error', err.error?.message || 'Unexpected error occurred.');
        }
      });
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  close() {
    this.dialogRef.close();
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}