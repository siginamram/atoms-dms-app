import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AdCampaignTrakerEditComponent } from '../ad-campaign-traker-edit/ad-campaign-traker-edit.component';

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
  selector: 'app-ad-campaign-traker',
  standalone:false,
  templateUrl: './ad-campaign-traker.component.html',
  styleUrl: './ad-campaign-traker.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignTrakerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Data and Filters
  isLoading = false; // Initially set to true
  selecteddate: any = ''; // Default selected client
  selectedMonthYear: Date | null = null;
  startAtDate = new Date();
  leads: any[] = [];
  searchTerm: string = '';
  formattedMonthYear: string = '';
  clientId: number = 0;
  readonly date = new FormControl(moment());
  clientName: string = '';
  // dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'campaignStartDate',
    'campaignEndDate',
    'platform',
    'objective',
    'reach',
    'impressions',
    'resultType',
    'result',
    'costPerResult',
    'targetAmount', 
    'amountSpent',
    'edit'
  ];
// Add dummy data including targetAmount
dataSource = new MatTableDataSource<any>([
  {
    campaignStartDate: '2025-01-01',
    campaignEndDate: '2025-01-15',
    platform: 'Facebook',
    objective: 'Conversions',
    reach: 5000,
    impressions: 7000,
    resultType: 'Leads',
    result: 50,
    costPerResult: 10,
    amountSpent: 500,
    targetAmount: 600 // Add targetAmount to data
  },
  // Add more rows as needed
]);
  // Popup Management
  isPopupVisible = false;
  isEditMode = false;
  clientForm: FormGroup;

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private operationsService: OperationsService) {
    this.clientForm = this.fb.group({
      clientName: [''],

    });
  }

  ngOnInit(): void {
    // Retrieve clientId and date from query parameters
    this.route.queryParams.subscribe((params) => {
      this.clientId = Number(params['clientId']) || 0; // Ensure correct case ('clientId')
      this.selecteddate = params['date'] ? new Date(params['date']).toISOString() : null;

      // Fetch the client details
      this.fetchClientDetails(this.clientId);
      console.log('Client ID:', this.clientId);
      console.log('Selected Date:', this.selecteddate);

      //this.fetchMonthlyTrackerData();

    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }
  fetchClientDetails(clientId: number): void {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (response) => {
        console.log('Client Details:', response);

        // Assuming response contains organizationName
        if (response?.organizationName) {
          this.clientForm.patchValue({ clientName: response.organizationName });
          this.clientName=response.organizationName;
        }
      },
      error: (error) => {
        console.error('Error fetching client details:', error);
      },
    });
  }
  fetchMonthlyTrackerData(): void {
    this.isLoading = true; // Start loading indicator
    this.operationsService.getMonthlyTrackerData(this.clientId, this.selecteddate).subscribe({
      next: (response) => {

        this.dataSource.data = response.map((item: any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          //contentStatus: item.contentStatus,
          //promotionType:tem.promotionId,
        }));
        this.isLoading = false; // Stop loading indicator
        this.dataSource.paginator = this.paginator; // Reassign paginator
      },
      error: (error) => {
        this.isLoading = false; // Stop loading indicator
        console.error('Error fetching tracker data:', error);
      },
    });
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.selecteddate = ctrlValue.format('YYYY-MM-DD'); // Update selectedDate
    datepicker.close();
    this.fetchMonthlyTrackerData();
  }

  onMonthYearSelected(event: moment.Moment, datepicker: any): void {
    if (event && event.isValid && event.isValid()) {
      // Format the selected date as MM/YYYY
      this.formattedMonthYear = event.format('MM/YYYY');
      console.log('Selected Month/Year:', this.formattedMonthYear);

      // Close the datepicker
      datepicker.close();

      // Trigger Angular change detection
      this.cdr.detectChanges();
    } else {
      console.error('Invalid date selected:', event);
    }
  }
  addNewEntry() {
    const dialogRef = this.dialog.open(AdCampaignTrakerEditComponent, {
         width: '600px',
         data: {
           isEdit: false,
           meetingData: null,
         },
       });
   
       dialogRef.afterClosed().subscribe((result) => {
         if (result) {
           console.log('Meet Scheduled:', result);
           this.fetchMonthlyTrackerData(); // Refresh data
         }
       });
  }

  onEdit(row: any): void {
    const dialogRef = this.dialog.open(AdCampaignTrakerEditComponent, {
      width: '600px',
      data: {
        isEdit: true,
        //meetingData: meet,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Meet Edited:', result);
        this.fetchMonthlyTrackerData(); // Refresh data
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/home/operations/ad-campaign-dma']); 
  }
}    
