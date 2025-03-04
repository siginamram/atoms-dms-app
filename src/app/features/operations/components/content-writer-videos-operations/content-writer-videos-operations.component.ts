import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { AddClientVideosEmergrncyRequestComponent } from '../add-client-videos-emergrncy-request/add-client-videos-emergrncy-request.component';
import { ContentWriterVideosOperationsEditComponent } from '../content-writer-videos-operations-edit/content-writer-videos-operations-edit.component';
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
  selector: 'app-content-writer-videos-operations',
  standalone:false,
  templateUrl: './content-writer-videos-operations.component.html',
  styleUrl: './content-writer-videos-operations.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentWriterVideosOperationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator
  showSpinner: boolean = false;
  // Filters
  clientId: number = 0;
  selectedDate: any = '';
  readonly date = new FormControl(moment());
  clientForm: FormGroup;
  // Table Data
  contentData = new MatTableDataSource<any>([]); // Initialize dataSource

  displayedColumns = [
    'id',
    'creativeType',
    'postScheduleOn',
    'shootLink',
    'editorLink',
    'thumbNail',
    'title',
    'description',
    'approvalStatus',
    'remarks',
    'actions',
    
  ];
  clientName: any;
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
      console.warn('Missing clientId or date');
      return;
    }
    this.showSpinner = true;
    this.operationsService
      .videoEditorMonthlyTracker(this.clientId, this.selectedDate)
      .subscribe({
        next: (response: any[]) => {
          this.showSpinner = false;
          this.contentData.data = response.map((item, index) => ({
            id: index + 1,
            creativeType:item.creativeType,
            shootLink: item.shootLink,
            editorLink: item.editorLink,
            title: item.title ,
            description: item.description ,
            status: this.mapGraphicStatus(item.status),
            remarks: item.remarks ,
            thumbNail: item.thumbNail ,
            monthlyTrackerId:item.monthlyTrackerId,
            postScheduleOn:item.postScheduleOn,
          }));
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (error) => {
          console.error('Error fetching table data:', error);
          this.contentData.data = []; // Clear table data on error
        },
      });
  }
  mapCreativeType(status: number): string {
    const statusMap: { [key: number]: string } = {
      3: 'YouTube Videos',
      4: 'Educational Reels',
    };
    return statusMap[status] || 'Unknown Type';
  }
  mapGraphicStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Yet to Start',
      2: 'Draft Saved',
      3: 'Sent for Approval',
      4: 'Changes Recommended',
      5: 'Approved',
      6: 'Sent for client approval'
    };
    return statusMap[status] || 'Unknown Status';
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
  
 addNewEntry() {
    if (!this.clientId) {
      alert('Client ID is missing. Please select a client.');
      return;
    }

    const dialogRef = this.dialog.open(AddClientVideosEmergrncyRequestComponent, {
      width: '600px',
      data: { clientId: this.clientId }, // Pass the clientId
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Operation Successful:', result);
        this.fetchTableData(); // Refresh the table after edit or save
      }
    });
  }
  openEditPopup(row: any): void {
    console.log('edit', row);
    const dialogRef = this.dialog.open(ContentWriterVideosOperationsEditComponent, {
      width: '600px',
      data: {
        monthlyTrackerId: row.monthlyTrackerId,
        userID: parseInt(localStorage.getItem('UserID') || '0', 10),
        editorLink: row.editorLink,
        title: row.title,
        thumbNail: row.thumbNail,
        description: row.description,
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
    this.router.navigate(['/home/operations/content-writer-videos-client']); 
  }
}
