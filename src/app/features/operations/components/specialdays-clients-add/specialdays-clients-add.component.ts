import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-specialdays-clients-add',
  standalone:false,
  templateUrl: './specialdays-clients-add.component.html',
  styleUrls: ['./specialdays-clients-add.component.css'],
})
export class SpecialdaysClientsAddComponent implements OnInit {
  allClients = ['Client A', 'Client B', 'Client C', 'Client D']; // Full list of clients
  filteredClients: string[] = []; // Clients displayed in the autocomplete
  //data = { date: null }; // Initialize date as null
  constructor(
    public dialogRef: MatDialogRef<SpecialdaysClientsAddComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { client: string; date: any; specialDay: string }
  ) {}

  ngOnInit(): void {
    if (this.data.date) {
      // If editing, show only the specific client
      this.filteredClients = [this.data.client];
    } else {
      // If adding, show all clients
      this.filteredClients = [...this.allClients];
    }
  }
// Handle Date Change
onDateSelected(event: any): void {
  if (event instanceof Date) {
    this.data.date = event; // Assign full date
  } else if (event._isAMomentObject) {
    this.data.date = event.toDate(); // Convert Moment.js object to Date
  }
  console.log('Selected Full Date:', this.data.date); // Debugging
}



  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
