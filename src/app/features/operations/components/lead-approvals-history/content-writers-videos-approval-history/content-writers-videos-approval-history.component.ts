import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { OperationsService } from '../../../services/operations.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { EditStatusApprovalsComponent } from '../../lead-approvals/edit-status-approvals/edit-status-approvals.component';

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
  selector: 'app-content-writers-videos-approval-history',
 standalone:false,
  templateUrl: './content-writers-videos-approval-history.component.html',
  styleUrl: './content-writers-videos-approval-history.component.css',
     providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class ContentWritersVideosApprovalHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showSpinner: boolean = false;
  readonly date = new FormControl(moment());
  organizationFilter = new FormControl('');
  resourceFilter = new FormControl('');
  postStatusFilter = new FormControl('');
  activeFilter: string | null = null;

  displayedColumns: string[] = [
    'sNo',
    'organizationName',
    'sentForApprovalOn',
    'resourceName',
    'creativeType',
    'title',
    'description',
    'thumbNail',
    'shootLink',
    'editorLink',
    'contentStatus',
    'remarks',
    'action',
  ];

  dataSource = new MatTableDataSource<any>();

  constructor(
    private operationsService: OperationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchGraphicApprovalRequests();

    // Apply column filters dynamically
    this.organizationFilter.valueChanges.subscribe(() => this.applyFilter());
    this.resourceFilter.valueChanges.subscribe(() => this.applyFilter());
    this.postStatusFilter.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchGraphicApprovalRequests(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '1', 10); // Default to 1 if user ID is not found
    const selectedDate = this.date.value?.format('YYYY-MM') || moment().format('YYYY-MM');
    this.showSpinner = true;
    this.operationsService.videoContentApprovalHistory(userId, `${selectedDate}-01`).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          contentStatus: this.getPostStatusText(item.contentStatus), // ✅ Ensure correct mapping
          monthlyTrackerId: item.monthlyTrackerId,
          userId: userId,
          creativeTypeName: item.creativeType,
          creativeType: 5,
          role: 'Content-Video',
        }));
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error fetching video editor approval requests:', error);
      },
    });
  }

 // Helper method to map status numbers to text
 getPostStatusText(contentStatus: any): string {
  if (contentStatus == null || contentStatus === undefined) {
    return 'Unknown'; // Prevents null/undefined errors
  }

  // If status is a string like "Sent for approval", convert it to corresponding number
  const statusMap: { [key: string]: number } = {
    'yet to start': 1,
    'saved in draft': 2,
    'sent for approval': 3,
    'changes recommended': 4,
    'approved': 5,
    'sent for client approval': 6
  };

  // Convert string to number if necessary
  if (typeof contentStatus === 'string') {
    const lowerStatus = contentStatus.trim().toLowerCase();
    if (statusMap[lowerStatus] !== undefined) {
      contentStatus = statusMap[lowerStatus];
    } else {
      return 'Unknown'; // If it's an unrecognized string
    }
  }

  // Ensure status is a number before mapping
  contentStatus = Number(contentStatus);

  // Map number values to status text
  switch (contentStatus) {
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
    default:
      return 'Unknown';
  }
}

getStatusClass(contentStatus: any): string {
  const statusText = this.getPostStatusText(contentStatus).toLowerCase().replace(/\s+/g, '-');
  return `status-${statusText}`;
}

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchGraphicApprovalRequests();
  }

  applyFilter(): void {
    const organization = this.organizationFilter.value?.toLowerCase() || '';
    const resource = this.resourceFilter.value?.toLowerCase() || '';
    const postStatus = this.postStatusFilter.value?.toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      (!organization || data.organizationName?.toLowerCase().includes(organization)) &&
      (!resource || data.resourceName?.toLowerCase().includes(resource)) &&
      (!postStatus || data.status?.toLowerCase().includes(postStatus)); // ✅ **Fixed field reference**

    this.dataSource.filter = Math.random().toString(); // Trigger filter refresh
  }

  toggleFilter(column: string, event?: MouseEvent): void {
    if (
      event?.target instanceof HTMLElement &&
      event.target.closest('.column-filter-container') &&
      this.activeFilter === column
    ) {
      return;
    }
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  onEdit(row: any): void {
    const dialogRef = this.dialog.open(EditStatusApprovalsComponent, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchGraphicApprovalRequests(); // Refresh table after edit
      }
    });
  }
}


