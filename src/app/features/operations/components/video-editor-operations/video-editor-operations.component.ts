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
import { VideoEditorOperationsEditComponent } from '../video-editor-operations-edit/video-editor-operations-edit.component';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'app-video-editor-operations',
  standalone: false,
  templateUrl: './video-editor-operations.component.html',
  styleUrls: ['./video-editor-operations.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoEditorOperationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator

  // Filters
  clientId: number = 0;
  selectedDate: string = '';
  readonly date = new FormControl(moment());
  clientForm: FormGroup;
  // Table Data
  contentData = new MatTableDataSource<any>([]); // Initialize dataSource

  displayedColumns = [
    'id',
    'creativeType',
    'shootLink',
    'editorLink',
    'thumbNail',
    'title',
    'description',
    'approvalStatus',
    'remarks',
    'actions',
    
  ];
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

    this.operationsService
      .videoEditorMonthlyTracker(this.clientId, this.selectedDate)
      .subscribe({
        next: (response: any[]) => {
          this.contentData.data = response.map((item, index) => ({
            id: index + 1,
            creativeType:item.creativeType,
            shootLink: item.shootLink,
            editorLink: item.editorLink,
            title: item.title || 'No Title',
            description: item.description || 'No Description',
            status: this.mapGraphicStatus(item.status),
            remarks: item.remarks || 'No Remarks',
            thumbNail: item.thumbNail || 'No ThumbNail',
            monthlyTrackerId:item.monthlyTrackerId,
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

  openEditPopup(row: any): void {
    console.log('edit', row);
    const dialogRef = this.dialog.open(VideoEditorOperationsEditComponent, {
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

}
