import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
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

  // Table Data
  contentWritersData = [
    {
      date: '2024-12-20',
      day: 'Monday',
      speciality: 'Speciality 1',
      promotionType: 'Branding',
      language: 'English',
      creativeType: 'Poster',
      approvalStatus: 'Pending',
      remarks: 'Pending review',
    },
    {
      date: '2024-12-21',
      day: 'Tuesday',
      speciality: 'Speciality 2',
      promotionType: 'Education',
      language: 'Telugu',
      creativeType: 'Reel',
      approvalStatus: 'Approved',
      remarks: 'Approved',
    },
  ];

  filteredData = this.contentWritersData;
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

      if (this.clientId && this.selecteddate) {
        this.fetchMonthlyTrackerData(this.clientId, this.selecteddate);
      } else {
        console.warn('Client ID or date is missing in the query parameters.');
      }
    });
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

  fetchMonthlyTrackerData(clientId: number, date: string): void {
    this.operationsService.getMonthlyTrackerData(clientId, date).subscribe({
      next: (response) => {
        console.log('Fetched Tracker Data:', response); // Log the API response
  
        // Map the response to include necessary computed properties
        this.dataSource.data = response.map((item:any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          contentStatusText: this.getStatusText(item.contentStatus),
        }));
      },
      error: (error) => {
        console.error('Error fetching tracker data:', error);
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
        console.log('Popup closed with result:', result);
        // Optionally refresh data or perform actions based on result
      } else {
        console.log('Popup closed without saving changes.');
      }
    });
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
  // Calculate Totals
  calculateTotals() {
    this.totalPosters = this.filteredData.filter(item => item.creativeType === 'Poster').length;
    this.totalReels = this.filteredData.filter(item => item.creativeType === 'Reel').length;

    this.brandingPosterCount = this.filteredData.filter(
      item => item.promotionType === 'Branding' && item.creativeType === 'Poster'
    ).length;

    this.brandingReelCount = this.filteredData.filter(
      item => item.promotionType === 'Branding' && item.creativeType === 'Reel'
    ).length;

    this.educationalPosterCount = this.filteredData.filter(
      item => item.promotionType === 'Education' && item.creativeType === 'Poster'
    ).length;

    this.educationalReelCount = this.filteredData.filter(
      item => item.promotionType === 'Education' && item.creativeType === 'Reel'
    ).length;

    this.memePosterCount = this.filteredData.filter(
      item => item.promotionType === 'Meme' && item.creativeType === 'Poster'
    ).length;

    this.memeReelCount = this.filteredData.filter(
      item => item.promotionType === 'Meme' && item.creativeType === 'Reel'
    ).length;
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
        console.log('Popup closed with result:', result);
        // Optionally, refresh data or perform actions based on result
      } else {
        console.log('Popup closed without saving changes.');
      }
    });
  }
  }    
