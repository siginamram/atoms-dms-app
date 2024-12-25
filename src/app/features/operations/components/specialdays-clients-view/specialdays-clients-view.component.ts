import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpecialdaysClientsAddComponent } from '../specialdays-clients-add/specialdays-clients-add.component';

@Component({
  selector: 'app-specialdays-clients-view',
  standalone:false,
  templateUrl: './specialdays-clients-view.component.html',
  styleUrls: ['./specialdays-clients-view.component.css'],
})
export class SpecialdaysClientsViewComponent {
  // Filters
  allClients = ['Client A', 'Client B', 'Client C', 'Client D'];
  filteredClients: string[] = [...this.allClients];
  years = ['2024', '2025'];
  selectedClient: string = '';
  selectedYear: string = '';

  // Table Data
  specialDays = [
    { date: '2024-01-01', specialDay: 'New Year Celebration', client: 'Client A' },
    { date: '2024-02-14', specialDay: 'Valentine’s Day Special', client: 'Client B' },
    { date: '2024-03-08', specialDay: 'Women’s Day Special', client: 'Client A' },
  ];

  filteredData = [...this.specialDays]; // Filtered data for the table

  displayedColumns = ['date', 'specialDay', 'client', 'actions'];

  constructor(public dialog: MatDialog) {}

  // Open Add/Edit Popup
  openDialog(editData: any = null): void {
    const dialogRef = this.dialog.open(SpecialdaysClientsAddComponent, {
      width: '400px',
      data: editData || { date: '', specialDay: '', client: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (editData) {
          // Edit existing entry
          const index = this.specialDays.indexOf(editData);
          if (index !== -1) this.specialDays[index] = result;
        } else {
          // Add new entry
          this.specialDays.push(result);
        }
        this.applyFilters(); // Reapply filters after any change
      }
    });
  }

  // Apply Filters
  applyFilters(): void {
    this.filteredData = this.specialDays.filter((entry) => {
      const matchesClient =
        !this.selectedClient || entry.client.toLowerCase().includes(this.selectedClient.toLowerCase());
      const matchesYear = !this.selectedYear || entry.date.startsWith(this.selectedYear);
      return matchesClient && matchesYear;
    });
  }

  // Filter Clients for Autocomplete
  filterClients(): void {
    const search = this.selectedClient.toLowerCase();
    this.filteredClients = this.allClients.filter((client) =>
      client.toLowerCase().includes(search)
    );
  }

  // Delete Entry
  deleteEntry(element: any): void {
    const index = this.specialDays.indexOf(element);
    if (index !== -1) {
      this.specialDays.splice(index, 1);
      this.applyFilters(); // Reapply filters after deletion
    }
  }
}
