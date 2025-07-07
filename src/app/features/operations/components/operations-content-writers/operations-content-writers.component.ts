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
  isLoading = false; // Initially set to true
  selecteddate: any = ''; // Default selected client
  selectedDate : any = ''; // Default selected client
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
  clientName:string=''; 
  // Column Filters
  specialityFilter = new FormControl('');
  promotionTypeFilter = new FormControl('');
  languageFilter = new FormControl('');
  creativeTypeFilter = new FormControl('');
  contentStatusFilter = new FormControl('');
  activeFilter: string | null = null; // To track the currently active filter
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'postScheduleOn',
    'speciality',
    'promotionType',
    'creativeType',
    'language',
    'contentStatus',
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
  toggleFilter(column: string, event?: MouseEvent): void {
    // Check if the clicked element is part of the filter input
    if (
      event?.target instanceof HTMLElement &&
      event.target.closest('.column-filter-container') &&
      this.activeFilter === column
    ) {
      return; // Do nothing if clicking inside the filter container
    }

    // Toggle the filter visibility for the clicked column
    this.activeFilter = this.activeFilter === column ? null : column;
  }
  ngOnInit(): void {
    // Retrieve clientId and date from query parameters
    this.route.queryParams.subscribe((params) => {
      this.clientId = Number(params['clientId']) || 0; // Ensure correct case ('clientId')
      this.selecteddate = params['date'] ? new Date(params['date']).toISOString() : null;
      if (params['date']) {
        this.selectedDate = moment(params['date'], 'YYYY-MM-DD'); // Convert to Moment object
        this.date.setValue(this.selectedDate); // Update FormControl
      } else {
        this.selectedDate = moment(); // Default to current date
      }
      // Fetch the client details
      this.fetchClientDetails(this.clientId);
      this.fetchClientDeliverablesAndPackages(this.clientId);
      this.fetchMonthlyTrackerData();

    });
    // Apply filters dynamically
    this.specialityFilter.valueChanges.subscribe(() => this.applyFilter());
    this.promotionTypeFilter.valueChanges.subscribe(() => this.applyFilter());
    this.languageFilter.valueChanges.subscribe(() => this.applyFilter());
    this.creativeTypeFilter.valueChanges.subscribe(() => this.applyFilter());
    this.contentStatusFilter.valueChanges.subscribe(() => this.applyFilter());
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
    this.operationsService.getMonthlyTrackerData(this.clientId, this.selecteddate,0).subscribe({
      next: (response) => {

        this.dataSource.data = response.map((item: any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          contentStatus: this.getStatusText(item.contentStatus),
          promotionType:this.getpromotionType(item.promotionId),
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
  forecast() {

    this.isLoading = true; // Start loading indicator
    this.operationsService.getMonthlyTrackerData(this.clientId, this.selecteddate,1).subscribe({
      next: (response) => {

        this.dataSource.data = response.map((item: any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          contentStatus: Number(item.contentStatus) || 0,
          promotionType:this.getpromotionType(item.promotionId),
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

  fetchClientDeliverablesAndPackages(clientId: number): void {
    this.isLoading = true;
    this.operationsService.getclientDeliverablesAndPackages(clientId).subscribe({
      next: (response: any) => {
        if (response && response.length > 0) {
          this.isLoading = false; // Stop loading indicator
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
  getStatusText(status: any): string {
    if (status == null || status === undefined) {
      return 'Unknown'; // Prevents null/undefined errors
    }
  
    // If status is a string like "Sent for approval", convert it to corresponding number
    const statusMap: { [key: string]: number } = {
      'yet to start': 1,
      'saved in draft': 2,
      'sent for approval': 3,
      'changes recommended': 4,
      'approved': 5,
      'sent for client approval': 6,
      'lead approval completed': 7, // Added for completeness
    };
  
    // Convert string to number if necessary
    if (typeof status === 'string') {
      const lowerStatus = status.trim().toLowerCase();
      if (statusMap[lowerStatus] !== undefined) {
        status = statusMap[lowerStatus];
      } else {
        return 'Unknown'; // If it's an unrecognized string
      }
    }
  
    // Ensure status is a number before mapping
    status = Number(status);
  
    // Map number values to status text
    switch (status) {
      case 1:
        return 'Yet to start';
      case 2:
        return 'Saved in draft';
      case 3:
        return 'Sent for approval';
      case 4:
        return 'Changes recommended';
      case 5:
        return 'Approved';
      case 6:
        return 'Sent for client approval';
       case 7:
        return 'Lead approval Completed'; // Added for completeness
      default:
        return 'Unknown';
    }
  }
  
 

  getpromotionType(status: number): string {
    switch (status) {
      case 1:
        return 'Branding';
      case 2:
        return 'Educational';
      case 3:
        return 'Meme';
      case 4:
        return 'Emergency';
      case 5:
        return 'Special Day';
      default:
        return 'Unknown status';
    }
  } 

  getStatusClass(status: any): string {
    const statusText = this.getStatusText(status).toLowerCase().replace(/\s+/g, '-');
    return `status-${statusText}`;
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
        contentInPost: row.contentInPost,
        contentCaption: row.contentCaption,
        title:row.title,
        referenceDoc: row.referenceDoc,
        status:row.contentStatus,
        creativeType:row.creativeTypeId,
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
  applyFilter(): void {
    const speciality = this.specialityFilter.value?.toLowerCase() || '';
    const promotionType = this.promotionTypeFilter.value?.toLowerCase() || '';
    const language = this.languageFilter.value?.toLowerCase() || '';
    const creativeType = this.creativeTypeFilter.value?.toLowerCase() || '';
    const contentStatus = this.contentStatusFilter.value?.toLowerCase() || '';
    this.dataSource.filterPredicate = (data: any) =>
      (!speciality || data.speciality?.toLowerCase().includes(speciality)) &&
      (!promotionType || data.promotionType?.toLowerCase().includes(promotionType)) &&
      (!language || data.language?.toLowerCase().includes(language)) &&
      (!creativeType || data.creativeType?.toLowerCase().includes(creativeType)) &&
      (!contentStatus || data.contentStatus?.toLowerCase().includes(contentStatus));
    this.dataSource.filter = Math.random().toString(); // Trigger filter update
  }
  goBack(): void {
    this.router.navigate(['/home/operations/content-writer-client']); 
  }
}    
