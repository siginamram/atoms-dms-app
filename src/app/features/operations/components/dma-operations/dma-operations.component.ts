import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
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
  @ViewChild('fullTextDialog') fullTextDialog: any;
  clients: any[] = [];
  filteredClients: any[] = [];
  clientId: number = 0;
  selectedDate: any = '';
  clientName:string=''; 
  showSpinner: boolean = false;
  clientForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'creativeType',
    'promotionType',
    'language',
    'speciality',
    'contentInPost',
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
  date = new FormControl(moment());
  selecteddate: any | null;
  constructor(private operationsService: OperationsService,
    private fb: FormBuilder,
     private dialog: MatDialog,
     private router: Router,
     private route: ActivatedRoute,
    ) {
      this.clientForm = this.fb.group({
        clientName: [''],
      });
    }

  ngOnInit(): void {
// Retrieve clientId and date from query parameters
    this.route.queryParams.subscribe((params) => {
      this.clientId = Number(params['clientId']) || 0;
     
      if (params['date']) {
        this.selectedDate = moment(params['date'], 'YYYY-MM').format('YYYY-MM'); // Store only Year and Month
        this.date.setValue(moment(this.selectedDate, 'YYYY-MM')); // Update FormControl
      } else {
        this.selectedDate = moment().format('YYYY-MM'); // Default to current month-year
        this.date.setValue(moment(this.selectedDate, 'YYYY-MM')); // Update FormControl
      }
      
      // Fetch client details and table data
      this.fetchClientDetails(this.clientId);
      this.fetchTableData();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchClientDetails(clientId: number): void {
    this.showSpinner = true;
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (response) => {
        if (response?.organizationName) {
          this.clientForm.patchValue({ clientName: response.organizationName });
          this.clientName=response.organizationName;
          this.showSpinner = false;
        }
      },
      error: (error) => 
        console.error('Error fetching client details:', error),
    });
  }



  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.year(normalizedMonthAndYear.year());
    ctrlValue.month(normalizedMonthAndYear.month());
    this.date.setValue(ctrlValue);
  
    this.selectedDate = ctrlValue.format('YYYY-MM'); // Store only Year and Month
    datepicker.close(); // Close picker after selection
  
    this.fetchTableData(); // Refresh data
  }
  
  // Handle Year Selection
  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }
  
  // Handle Month Selection (Final Step before closing picker)
  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
  
    this.selectedDate = ctrlValue.format('YYYY-MM'); // Store only Year and Month
    datepicker.close(); // Close picker after selection
  
    this.fetchTableData(); // Refresh data
  }
  
  

  fetchTableData(): void {
    //debugger;
    // const selectedClient = this.clients.find((client) => client.organizationName === this.clientControl.value);
    // const clientId = selectedClient?.clientId || 0;
    // const date = this.dateControl.value?.format('YYYY-MM') + '-01';

    if (!this.clientId || !this.selectedDate) {
      console.warn('Please select both Client and Date to filter.');
      return;
    }
    this.showSpinner = true;
    this.operationsService.DMAMonthlyTracker(this.clientId, this.selectedDate).subscribe({
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
        this.showSpinner = false;
      },
      error: (error) => {
        console.error('Error fetching table data:', error);
        this.showSpinner = false;
        this.dataSource.data = [];
      },
    });
  }
 // Helper method to map status numbers to text
//  getStatusText(status: number): string {
//   switch (status) {
//     case 1:
//       return 'Yet to start';
//     case 2:
//       return 'Saved in draft';
//     case 3:
//       return 'Send for approval';
//     case 4:
//       return 'Changes recommended';
//     case 5:
//       return 'Approved';
//       case 6:
//         return 'Sent for client approval';
//     default:
//       return 'Unknown status';
//   }
// }

// getpostStatus(status: number): string {
//   switch (status) {
//     case 1:
//       return 'Yet to Post';
//     case 2:
//       return 'Early Post';
//     case 3:
//       return 'On Time Post';
//     case 4:
//       return 'Late Posted';
//     case 5:
//         return 'Client Rejected';
//     default:
//       return 'N/A';
//   }
// }
getStatusText(status: any): string {
  if (status == null || status === undefined) {
    return 'Unknown Status'; // Handle null/undefined
  }

  // Convert string statuses to numbers if needed
  const statusMap: { [key: number]: string } = {
    1: 'Yet to Start',
    2: 'Draft Saved',
    3: 'Sent for Approval',
    4: 'Changes Recommended',
    5: 'Approved',
    6: 'Sent for Client Approval',
    7: 'Lead approval Completed',
  };

  // If status is a string like "Sent for Approval", try converting
  if (typeof status === 'string') {
    const reverseStatusMap: { [key: string]: number } = Object.fromEntries(
      Object.entries(statusMap).map(([key, value]) => [value.toLowerCase(), Number(key)])
    );

    const lowerStatus = status.trim().toLowerCase();
    if (reverseStatusMap[lowerStatus] !== undefined) {
      status = reverseStatusMap[lowerStatus];
    } else {
      return 'Unknown Status'; // If it's an unrecognized string
    }
  }

  // Convert number-like strings ("1") to numbers (1)
  status = Number(status);

  return statusMap[status] || 'Unknown Status';
}

getpostStatus(status: any): string {
  if (status == null || status === undefined) {
    return 'Unknown Status'; // Handle null/undefined
  }

  // Convert string statuses to numbers if needed
  const statusMap: { [key: number]: string } = {
    1: 'Yet to Post',
    2: 'Early Post',
    3: 'On Time Post',
    4: 'Late Posted',
    5: 'Client Rejected',
    6: 'Filed'
  };

  // If status is a string like "Sent for Approval", try converting
  if (typeof status === 'string') {
    const reverseStatusMap: { [key: string]: number } = Object.fromEntries(
      Object.entries(statusMap).map(([key, value]) => [value.toLowerCase(), Number(key)])
    );

    const lowerStatus = status.trim().toLowerCase();
    if (reverseStatusMap[lowerStatus] !== undefined) {
      status = reverseStatusMap[lowerStatus];
    } else {
      return 'Unknown Status'; // If it's an unrecognized string
    }
  }

  // Convert number-like strings ("1") to numbers (1)
  status = Number(status);

  return statusMap[status] || 'Unknown Status';
}
getStatusClass(status: any): string {
  const statusText = this.getStatusText(status).toLowerCase().replace(/\s+/g, '-');
  return `status-${statusText}`;
}

getStatusClasspost(status: any): string {
  const statusText = this.getpostStatus(status).toLowerCase().replace(/\s+/g, '-');
  return `status-${statusText}`;
}

editRow(meet: any): void {
  const isFirstCase = meet.postStatus === 'Yet to start'; // Check if it's the first case

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

goBack(): void {
  this.router.navigate(['/home/operations/client-dma']); 
}
  
showFullText(text: string, title: string): void {
  this.dialog.open(this.fullTextDialog, {
    width: '400px',
    data: {
      text: text,
      title: title,
    },
  });
}
  
}
