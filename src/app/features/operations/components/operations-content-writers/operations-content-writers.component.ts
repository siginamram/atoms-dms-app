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

  displayedColumns: string[] = [
    'date',
    'day',
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

    // Add New Entry
    // addNewEntry() {
    //   this.router.navigate(['/home/operations/emergency-request-add'], {
    //     queryParams: {clientId:this.clientId },
    //   });
    // }

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
