import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Router,ActivatedRoute } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AddClientEmergencyRequestComponent } from '../add-client-emergency-request/add-client-emergency-request.component'; 
import { ContentWritersOperationsEditComponent } from '../content-writers-operations-edit/content-writers-operations-edit.component';

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
  selector: 'app-operations-content-writers',
  standalone: false,
  templateUrl: './operations-content-writers.component.html',
  styleUrls: ['./operations-content-writers.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsContentWritersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Data and Filters
  selecteddate: any = ''; // Default selected client
  selectedMonthYear: Date | null = null;
  startAtDate = new Date();
  leads: any[] = [];
  searchTerm: string = '';
  formattedMonthYear: string = '';
  clientId: number = 0;
  readonly date = new FormControl(moment());
  // Metrics
  brandingPosterCount = 0;
  brandingReelCount = 0;
  educationalPosterCount = 0;
  educationalReelCount = 0;
  memePosterCount = 0;
  memeReelCount = 0;

  totalPosters = 0;
  totalReels = 0;
 
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'speciality',
    'promotionType',
    'language',
    'creativeType',
    'approval',
    'remarks',
    'edit',
  ];

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
  
      if (!this.clientId) {
        console.warn('Client ID is missing in the query parameters.');
        //alert('Client ID is required to proceed.');
        // Optionally redirect or handle the missing ID case
      }
     // Fetch the client details
     this.fetchClientDetails(this.clientId);
      console.log('Client ID:', this.clientId);
      console.log('Selected Date:', this.selecteddate);
      this.fetchClientDeliverablesAndPackages(this.clientId);
      if (this.clientId && this.selecteddate) {
        this.fetchMonthlyTrackerData();
      } else {
        console.warn('Client ID or date is missing in the query parameters.');
      }
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
        }
      },
      error: (error) => {
        console.error('Error fetching client details:', error);
      },
    });
  }
  fetchMonthlyTrackerData(): void {
    //this.isLoading = true; // Start loading indicator
    this.operationsService.getMonthlyTrackerData(this.clientId, this.selecteddate).subscribe({
      next: (response) => {
       // this.isLoading = false; // Stop loading indicator
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          contentStatusText: this.getStatusText(item.contentStatus),
        }));
        this.dataSource.paginator = this.paginator; // Reassign paginator
      },
      error: (error) => {
        //this.isLoading = false; // Stop loading indicator
        console.error('Error fetching tracker data:', error);
      },
    });
  }
  
  fetchClientDeliverablesAndPackages(clientId: number): void {
    this.operationsService.getclientDeliverablesAndPackages(clientId).subscribe({
      next: (response: any) => {
        console.log('Deliverables and Packages:', response);
        if (response && response.length > 0) {
          const deliverables = response[0];
          this.brandingPosterCount = deliverables.noOfBandingPosters || 0;
          this.brandingReelCount = deliverables.noOfBandingReels || 0;
          this.educationalPosterCount = deliverables.noOfEducationalPosters || 0;
          this.educationalReelCount = deliverables.noOfEducationalGraphicReels || 0;
          this.memePosterCount = deliverables.noOfMemePosters || 0;
          this.memeReelCount = deliverables.noOfMemeReels || 0;

          // Calculate total posters and reels
          this.totalPosters =
            this.brandingPosterCount +
            this.educationalPosterCount +
            this.memePosterCount;

          this.totalReels =
            this.brandingReelCount +
            this.educationalReelCount +
            this.memeReelCount;
        }
      },
      error: (err) => {
        console.error('Error fetching client deliverables:', err);
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
  
  onEdit(row: any): void {
    console.log('Edit action for row:', row); // Check if monthlyTrackerId exists
    if (!row.monthlyTrackerId) {
      alert('Monthly Tracker ID is missing. Please select a valid entry.');
      return;
    }
  
    const dialogRef = this.dialog.open(ContentWritersOperationsEditComponent, {
      width: '600px',
      data: { 
        monthlyTrackerId: row.monthlyTrackerId,
         clientId: row.clientId,
         contentInPost:row.contentInPost,
         contentCaption:row.contentCaption,
         referenceDoc:row.referenceDoc,
         },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Operation Successful:', result);
        this.fetchMonthlyTrackerData(); // Refresh the table after edit or save
      }
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
    if (!this.clientId) {
      alert('Client ID is missing. Please select a client.');
      return;
    }
  
    const dialogRef = this.dialog.open(AddClientEmergencyRequestComponent, {
      width: '600px',
      data: { clientId: this.clientId }, // Pass the clientId
    });
  
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Operation Successful:', result);
        this.fetchMonthlyTrackerData(); // Refresh the table after edit or save
      }
    });
  }
  }    
