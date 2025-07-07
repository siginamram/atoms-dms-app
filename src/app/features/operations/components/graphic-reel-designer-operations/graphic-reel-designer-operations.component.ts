import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { GraphicReelDesignerOperationsEditComponent } from '../graphic-reel-designer-operations-edit/graphic-reel-designer-operations-edit.component';
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
  selector: 'app-graphic-reel-designer-operations',
  standalone:false,
  templateUrl: './graphic-reel-designer-operations.component.html',
  styleUrl: './graphic-reel-designer-operations.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicReelDesignerOperationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fullTextDialog') fullTextDialog: any;
  clientId: number = 0;
  selectedDate: any = '';
  creativeType: number = 2; // Default creativeType
  clientName:string=''; 
  clientForm: FormGroup;
  showSpinner: boolean = false;
  displayedColumns: string[] = [
   'id',
   'postScheduleOn',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'contentInPost',
    'caption',
    'contentLink',
    'status',
    'relatedRemarks',
    'actions',
  ];
  contentData = new MatTableDataSource<any>([]); // Initialize dataSource
  date = new FormControl(moment());

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private operationsService: OperationsService
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
    this.contentData.paginator = this.paginator; // Assign paginator after view initialization
  }
  fetchClientDetails(clientId: number): void {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (response) => {
        if (response?.organizationName) {
          this.clientForm.patchValue({ clientName: response.organizationName });
          this.clientName=response.organizationName;
        }
      },
      error: (error) => console.error('Error fetching client details:', error),
    });
  }

  fetchTableData(): void {
    if (!this.clientId || !this.selectedDate) {
      console.warn('Missing clientId or date for table data');
      return;
    }
    this.showSpinner = true;
    this.operationsService
      .GraphicDesignerMonthlyTracker(this.clientId, this.selectedDate, this.creativeType)
      .subscribe({
        next: (response: any[]) => {
          this.showSpinner = false;
          this.contentData.data = response.map((item) => ({
            date: moment(item.specialDayDate).format('YYYY-MM-DD'),
            client: this.clientForm.value.clientName,
            postScheduleOn:item.postScheduleOn,
            speciality: item.speciality,
            promotionType:this.getpromotionType(item.promotionId),
            creativeType: item.creativeType,
            language:item.language,
            caption: item.contentCaption,
            contentInPost: item.contentInPost,
            referenceDoc:item.referenceDoc,
            link: item.link,
            status: this.mapGraphicStatus(item.graphicStatus),
            relatedRemarks: item.graphicRemarks || 'No remarks',
            monthlyTrackerId:item.monthlyTrackerId,
          }));
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (error) => {
          this.showSpinner = false;
          console.error('Error fetching table data:', error);
          this.contentData.data = []; // Clear table on error
        },
      });
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
  mapGraphicStatus(status: any): string {
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
      7: 'Lead approval Completed', // Added for completeness
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
    const statusText = this.mapGraphicStatus(status).toLowerCase().replace(/\s+/g, '-');
    return `status-${statusText}`;
  }
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.selectedDate = ctrlValue.format('YYYY-MM-DD'); // Update selectedDate
    datepicker.close();
    this.fetchTableData(); // Fetch table data for the new date
  }
  openEditPopup(row: any): void {
    console.log('edit',row);
    const dialogRef = this.dialog.open(GraphicReelDesignerOperationsEditComponent, {
      width: '600px',
      data: {
        trackerID: row.monthlyTrackerId,
        userID: parseInt(localStorage.getItem('UserID') || '0', 10),
        caption: row.caption,
        contentInPost: row.contentInPost,
        referenceDoc:row.referenceDoc,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTableData();
        // Refresh data or perform actions after popup close
        console.log('Popup result:', result);
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home/operations/graphicreels-designer-client']); 
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
