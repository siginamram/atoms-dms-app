import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-client-meta-data-edit',
  standalone:false,
  templateUrl: './client-meta-data-edit.component.html',
  styleUrls: ['./client-meta-data-edit.component.css']
})
export class ClientMetaDataEditComponent implements OnInit {
  metaForm!: FormGroup;
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientId: any;
  selectedClientName: string = '';
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog, // Inject MatDialog
    private dialogRef: MatDialogRef<ClientMetaDataEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private operationsService: OperationsService
  ) {}

ngOnInit(): void {
  this.fetchAllClients();

  this.selectedClientId = this.data.clientId;
  if (this.selectedClientId > 0) {
    this.selectedClientName = this.data.organizationName || '';
  }

  this.metaForm = this.fb.group({
    clientId: [this.data.clientId, Validators.required],
    facebookPageId: [this.data.facebookPageId, Validators.required],
    instagramPageId: [this.data.instagramPageId],
    facebookPageToken: [this.data.facebookPageToken, Validators.required],
    youtubeRefreshToken: [this.data.youtubeRefreshToken],
    postTime: [this.data.postTime, Validators.required],
    specialDayPostTime: [this.data.specialDayPostTime, Validators.required],
    updateBy: [this.userId]
  });
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
  const selectedOrganizationName = event.option.value;
  const selectedClient = this.clients.find(
    (client) => client.organizationName === selectedOrganizationName
  );

  if (selectedClient) {
    this.selectedClientId = selectedClient.clientId || 0;
    this.selectedClientName = selectedClient.organizationName;
    this.metaForm.patchValue({ clientId: this.selectedClientId });
  }
}

  submit(): void {
    if (this.metaForm.valid) {
      const formValue = this.metaForm.value;

      const payload = {
        clientId: formValue.clientId,
        instagramPageId: formValue.instagramPageId || "0",
        facebookPageId: formValue.facebookPageId || "0",
        facebookPageToken: formValue.facebookPageToken,
        youtubeRefreshToken: formValue.youtubeRefreshToken,
        postTime: this.formatToTimeSpan(formValue.postTime),
        specialDayPostTime: this.formatToTimeSpan(formValue.specialDayPostTime),
        updateBy: formValue.updateBy
      };

      this.operationsService.AddClientMetadata(payload).subscribe({
        next: () => {
          this.openAlertDialog('Success', 'Data Saved Successfully!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.openAlertDialog('Error', error?.error?.title || 'Failed to submit metadata');
          console.error('Submit error:', error);
        }
      });
    }
  }
  formatToTimeSpan(time: string): string {
  // Ensures "17:00" becomes "17:00:00"
  return time?.length === 5 ? time + ':00' : time;
}

  close(): void {
    this.dialogRef.close();
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