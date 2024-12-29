import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { OperationsService } from '../../services/operations.service';
import { DmaOperationsEditComponent } from '../dma-operations-edit/dma-operations-edit.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dma-operations',
  standalone: false,
  templateUrl: './dma-operations.component.html',
  styleUrls: ['./dma-operations.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class DmaOperationsComponent implements OnInit {
  clientControl = new FormControl('');
  dateControl = new FormControl(moment());
  clients: any[] = [];
  filteredClients: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'creativeType',
    'promotionType',
    'language',
    'speciality',
    'contentCaption',
    'link',
    'thumbNail',
    'contentStatus',
    'graphicStatus',
    'postScheduleOn',
    'postedOn',
    'postStatus',
   
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private operationsService: OperationsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchClients();
    this.fetchTableData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchClients(): void {
    this.operationsService.getAllActiveClients().subscribe({
      next: (response: any[]) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (error) => console.error('Error fetching clients:', error),
    });
  }

  filterClients(event: Event): void {
    const input = (event.target as HTMLInputElement)?.value.toLowerCase() || '';
    this.filteredClients = this.clients.filter((client) =>
      client.organizationName.toLowerCase().includes(input)
    );
  }

  onClientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedClient = this.clients.find((client) => client.organizationName === event.option.value);
    if (selectedClient) {
      this.clientControl.setValue(selectedClient.organizationName);
      this.fetchTableData();
    }
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.dateControl.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dateControl.setValue(ctrlValue);
    datepicker.close();
    this.fetchTableData();
  }

  fetchTableData(): void {
    const selectedClient = this.clients.find((client) => client.organizationName === this.clientControl.value);
    const clientId = selectedClient?.clientId || 0;
    const date = this.dateControl.value?.format('YYYY-MM') + '-01';

    if (!clientId || !date) {
      console.warn('Please select both Client and Date to filter.');
      return;
    }

    this.operationsService.DMAMonthlyTracker(clientId, date).subscribe({
      next: (response: any[]) => {
        this.dataSource.data = response.map((item, index) => ({
          ...item,
          id: index + 1, // Add serial number dynamically
          contentStatus:this.getStatusText(item.contentStatus),
          graphicStatus:this.getStatusText(item.graphicStatus),
          monthlyTrackerId:item.monthlyTrackerId,
          postScheduleOn:item.postScheduleOn,
          postedOn:item.postedOn,
          postStatus:this.getpostStatus(item.postStatus),
          postRemarks:item.postRemarks,
          creativeTypeId:item.creativeTypeId,
        }));
      },
      error: (error) => {
        console.error('Error fetching table data:', error);
        this.dataSource.data = [];
      },
    });
  }
 // Helper method to map status numbers to text
 getStatusText(status: number): string {
  switch (status) {
    case 1:
      return 'Yet to start';
    case 2:
      return 'Saved in draft';
    case 3:
      return 'Send for approval';
    case 4:
      return 'Changes recommended';
    case 5:
      return 'Approved';
    default:
      return 'Unknown status';
  }
}

getpostStatus(status: number): string {
  switch (status) {
    case 1:
      return 'Yet to start';
    case 2:
      return 'Scheduled';
    case 3:
      return 'Posted';
    case 4:
      return 'Late Posted';
    default:
      return 'N/A';
  }
}
editRow(meet: any): void {
  const isFirstCase = meet.postStatus === 'Yet to start'; // Check if it's the first case
  console.log('Operation Successful:', meet);

  const dialogRef = this.dialog.open(DmaOperationsEditComponent, {
    width: '600px',
    data: {
      isFirstCase, // Pass flag to differentiate the cases
      meetingData: meet, // Pass the row data
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      console.log('Operation Successful:', result);
      this.fetchTableData(); // Refresh the table after edit or save
    }
  });
}

  
  
}
