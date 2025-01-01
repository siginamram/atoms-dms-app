import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OperationsService } from '../../services/operations.service';
import { SpecialdaysClientsAddComponent } from '../specialdays-clients-add/specialdays-clients-add.component';

@Component({
  selector: 'app-specialdays-clients-view',
  standalone: false,
  templateUrl: './specialdays-clients-view.component.html',
  styleUrls: ['./specialdays-clients-view.component.css'],
})
export class SpecialdaysClientsViewComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientId: number | null = null;
  selectedYear: string = '';
  selectedClientName: string = '';
  availableYears: string[] = ['2024', '2025']; // Update years as needed

  displayedColumns = ['id', 'date', 'specialDay', 'language','type', 'actions'];
  dataSource = new MatTableDataSource<any>(); // Use MatTableDataSource for pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.fetchAllClients();
    this.setDefaultYear();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator to MatTableDataSource
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
      this.selectedClientName = selectedClient.organizationName;
      this.fetchSpecialDays(); // Fetch data after client selection
    }
  }

  fetchSpecialDays(): void {
    if (this.selectedClientId && this.selectedYear) {
      this.operationsService
        .getSpecialDaysByClient(this.selectedClientId, parseInt(this.selectedYear, 10))
        .subscribe({
          next: (response: any[]) => {
            const mappedData = response.map((item) => ({
              id: item.specialDayId,
              date: new Date(item.specialDayDate).toLocaleDateString(),
              specialDay: item.speciality,
              languageId: item.languageId,
              type:this.getTypeText(item.type),
              language: this.getStatusText(item.languageId),
              client:
                this.clients.find((client) => client.clientId === item.clientId)?.organizationName ||
                'Unknown',
            }));
            this.dataSource.data = mappedData; // Update the table data
          },
          error: (error) => {
            console.error('Error fetching special days:', error);
          },
        });
    } else {
      this.dataSource.data = []; // Clear data if no client/year selected
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

  getTypeText(status: number): string {
    switch (status) {
      case 1:
        return 'Add';
      case 2:
        return 'Replace';
      default:
        return 'Unknown';
    }
  }

  openDialog(editData: any = null): void {
    const dialogRef = this.dialog.open(SpecialdaysClientsAddComponent, {
      width: '400px',
      data: editData
        ? {
            date: editData.date ? new Date(editData.date) : '', // Ensure the date is a valid Date object
            speciality: editData.specialDay || '',
            specialDayId: editData.id || '',
            clientId: this.selectedClientId || '',
            languageId: editData.languageId || '',
            type:editData.type || '',
          }
        : { date: '', specialDay: '', client: '', languageId: '',type:'' }, // Default for adding new
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchSpecialDays(); // Refresh data after adding/editing
      }
    });
  }
}
