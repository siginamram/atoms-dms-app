import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { SpecialdaysClientsAddComponent } from '../specialdays-clients-add/specialdays-clients-add.component';

@Component({
  selector: 'app-specialdays-clients-view',
  standalone:false,
  templateUrl: './specialdays-clients-view.component.html',
  styleUrls: ['./specialdays-clients-view.component.css'],
})
export class SpecialdaysClientsViewComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientId: number | null = null;
  selectedYear: string = '';
  selectedClientName: string = ''; // Add this line to declare selectedClientName
  filteredData: any[] = [];
  availableYears: string[] = ['2024', '2025']; // Update years as needed

  displayedColumns = ['id','date', 'specialDay', 'language','actions'];

  constructor(private dialog: MatDialog, private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.fetchAllClients();
    this.setDefaultYear();
  }

  setDefaultYear(): void {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear.toString();
  }

  fetchAllClients(): void {
    this.operationsService.getAllActiveClients().subscribe({
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
      this.selectedClientId = selectedClient.clientId;
      this.selectedClientName = selectedClient.organizationName; // Update the displayed name
      this.fetchSpecialDays(); // Fetch data after client selection
    }
  }
  

  fetchSpecialDays(): void {
    if (this.selectedClientId && this.selectedYear) {
      this.operationsService
        .getSpecialDaysByClient(this.selectedClientId, parseInt(this.selectedYear, 10))
        .subscribe({
          next: (response: any[]) => {
            this.filteredData = response.map((item) => ({
              date: new Date(item.specialDayDate).toLocaleDateString(),
              specialDay: item.speciality,
              specialDayId:item.specialDayId,
              languageId:item.languageId,
              language:this.getStatusText(item.languageId),
              client:
                this.clients.find((client) => client.clientId === item.clientId)?.organizationName ||
                'Unknown',
            }));
          },
          error: (error) => {
            console.error('Error fetching special days:', error);
          },
        });
    } else {
      this.filteredData = [];
    }
  }
  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'English';
      case 2:
        return 'Telugu';
      default:
        return 'Unknown';
    }
  }
  openDialog(editData: any = null): void {
    console.log('Edit Data:', editData);
    const dialogRef = this.dialog.open(SpecialdaysClientsAddComponent, {
      width: '400px',
      data: editData
        ? { 
            date: editData.date ? new Date(editData.date) : '', // Ensure the date is a valid Date object
            speciality: editData.specialDay || '',
            specialDayId:editData.specialDayId || '',
            clientId:  this.selectedClientId || '',
            languageId:editData.languageId || '',
          }
        : { date: '', specialDay: '', client: '' }, // Default for adding new
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchSpecialDays(); // Refresh data after adding/editing
      }
    });
  }
  
}
