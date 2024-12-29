import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatDialog } from '@angular/material/dialog';
import { PosterDesignerOperationsEditComponent } from '../poster-designer-operations-edit/poster-designer-operations-edit.component';
import { MatPaginator } from '@angular/material/paginator';

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
  selector: 'app-poster-designer-operations',
  standalone:false,
  templateUrl: './poster-designer-operations.component.html',
  styleUrls: ['./poster-designer-operations.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterDesignerOperationsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  clientId: number = 0;
  selectedDate: string = '';
  creativeType: number = 1; // Default creativeType
  clientForm: FormGroup;
  displayedColumns: string[] = [
   'id',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'caption',
    'contentInPost',
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
      console.warn('Missing clientId or date for table data');
      return;
    }

    this.operationsService
      .GraphicDesignerMonthlyTracker(this.clientId, this.selectedDate, this.creativeType)
      .subscribe({
        next: (response: any[]) => {
          this.contentData.data = response.map((item) => ({
            date: moment(item.specialDayDate).format('YYYY-MM-DD'),
            client: this.clientForm.value.clientName,
            speciality: item.speciality,
            promotionType:item.promotionType,
            creativeType: item.creativeType,
            language:item.language,
            caption: item.contentCaption,
            contentInPost: item.contentInPost,
            contentLink: item.referenceDoc,
            status: this.mapGraphicStatus(item.graphicStatus),
            relatedRemarks: item.graphicRemarks || 'No remarks',
            monthlyTrackerId:item.monthlyTrackerId,
          }));
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (error) => {
          console.error('Error fetching table data:', error);
          this.contentData.data = []; // Clear table on error
        },
      });
  }

  mapGraphicStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Yet to Start',
      2: 'Draft Saved',
      3: 'Sent for Approval',
      4: 'Changes Recommended',
      5: 'Approved',
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
    console.log('edit',row);
    const dialogRef = this.dialog.open(PosterDesignerOperationsEditComponent, {
      width: '600px',
      data: {
        trackerID: row.monthlyTrackerId,
        userID: parseInt(localStorage.getItem('UserID') || '0', 10),
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
