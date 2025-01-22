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
  dateControl = new FormControl(moment());
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
        this.selectedDate = params['date']
             ? moment(params['date']).format('YYYY-MM-DD')
             : moment().format('YYYY-MM-DD'); // Default to current date
             this.date.setValue(this.selectedDate); // Update FormControl

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
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        this.selectedDate = ctrlValue.format('YYYY-MM-DD'); // Update selectedDate
        datepicker.close();
        this.fetchTableData(); // Fetch table data for the new date
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
      case 6:
        return 'Sent for client approval';
    default:
      return 'Unknown status';
  }
}

getpostStatus(status: number): string {
  switch (status) {
    case 1:
      return 'Yet to Post';
    case 2:
      return 'Early Post';
    case 3:
      return 'On Time Post';
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
