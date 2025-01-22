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
    @ViewChild('fullTextDialog') fullTextDialog: any;
  clientId: number = 0;
  selectedDate: any = '';
  creativeType: number = 1; // Default creativeType
  clientName:string=''; 
  isLoading = false; // Initially set to true
  clientForm: FormGroup;
  displayedColumns: string[] = [
   'id',
    'postScheduleOn',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'caption',
    'contentInPost',
    'link',
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
    this.isLoading = true;
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (response) => {
        if (response?.organizationName) {
          this.clientForm.patchValue({ clientName: response.organizationName });
          this.clientName=response.organizationName;
        }
        this.isLoading = false;
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
            postScheduleOn:item.postScheduleOn,
            speciality: item.speciality,
            promotionType:this.getpromotionType(item.promotionId),
            creativeType: item.creativeType,
            language:item.language,
            caption: item.contentCaption,
            contentInPost: item.contentInPost,
            link: item.link,
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
      6:'Sent for client approval'
    };
    return statusMap[status] || 'Unknown Status';
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
        contentInPost:row.contentInPost,
        contentCaption:row.caption
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
    this.router.navigate(['/home/operations/poster-designer-client']); 
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
