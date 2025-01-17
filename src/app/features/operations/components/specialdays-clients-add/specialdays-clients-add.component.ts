import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-specialdays-clients-add',
  standalone: false,
  templateUrl: './specialdays-clients-add.component.html',
  styleUrls: ['./specialdays-clients-add.component.css'],
})
export class SpecialdaysClientsAddComponent implements OnInit {
  allClients: any[] = []; // Full list of clients
  filteredClients: any[] = []; // Clients displayed in the autocomplete
  selectedClientName: string = ''; // Selected client name for display
  isEditMode: boolean = false; // Determine if we are in edit mode
  showSpinner: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SpecialdaysClientsAddComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { clientId: number; date: any; speciality: string; specialDayId: number, languageId:number,type:any},
    private operationsService: OperationsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchAllClients();
  
    // Check if we are in edit mode
    this.isEditMode = !!this.data.specialDayId;
  
    if (this.isEditMode) {
      // Pre-fill client name, date, speciality, and language
      this.selectedClientName = this.resolveClientName(this.data.clientId);
      this.data.languageId = this.data.languageId || 1; // Default to English if not provided
    } else {
      // Set default values for Add mode
      this.data.languageId = 1; // Default language is English
    }
  }
  

  fetchAllClients(): void {
    this.operationsService.getAllActiveClients().subscribe({
      next: (response: any[]) => {
        this.allClients = response;
        this.filteredClients = response; // Initially show all clients

        // If editing, set the selected client name
        if (this.isEditMode) {
          this.selectedClientName = this.resolveClientName(this.data.clientId);
        }
      },
      error: (error) => {
        console.error('Error fetching active clients:', error);
      },
    });
  }

  filterClients(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredClients = this.allClients.filter((client) =>
      client.organizationName.toLowerCase().includes(input)
    );
  }

  onClientSelected(event: any): void {
    const selectedClient = this.allClients.find(
      (client) => client.organizationName === event.option.value
    );
    if (selectedClient) {
      this.data.clientId = selectedClient.clientId; // Set clientId based on selection
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.data.date || !this.data.speciality || !this.data.clientId || !this.data.languageId || !this.data.type) {
      alert('Please fill in all required fields.');
      return;
    }
    this.showSpinner = true;
    const payload = {
      specialDayId: this.data.specialDayId || 0,
      specialDayDate: this.formatDate(new Date(this.data.date)),
      speciality: this.data.speciality,
      clientId: this.data.clientId,
      languageId: this.data.languageId, // Include languageId in payload
      type:this.data.type,
      createdBy: parseInt(localStorage.getItem('UserID') || '0', 10),
    };
  
    this.operationsService.addSpecialDay(payload).subscribe({
      next: (response: string) => {
        if (response === 'Success') {
          this.showSpinner = false;
          this.openAlertDialog('Success', 'Special day saved successfully!');
          this.dialogRef.close(true);
        } else {
          this.showSpinner = false;
          this.openAlertDialog('Error', 'Failed to save special day: ' + response);
        }
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error saving special day:', error);
        this.openAlertDialog('Error', 'Please fill all required fields correctly.');
      },
    });
  }
  
  
  
  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Utility function to resolve client name from clientId
  private resolveClientName(clientId: number): string {
    const client = this.allClients.find((client) => client.clientId === clientId);
    return client ? client.organizationName : '';
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
