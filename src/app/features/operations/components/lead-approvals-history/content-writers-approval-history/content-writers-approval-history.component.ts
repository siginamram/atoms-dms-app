import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { OperationsService } from '../../../services/operations.service'; 
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
  selector: 'app-content-writers-approval-history',
  standalone:false,
  templateUrl: './content-writers-approval-history.component.html',
  styleUrl: './content-writers-approval-history.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class ContentWritersApprovalHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fullTextDialog') fullTextDialog: any;
  showSpinner: boolean = false;
readonly date = new FormControl(moment().add(1, 'month').startOf('month'));
  activeFilter: string | null = null;
  organizationFilter = new FormControl('');
  resourceFilter = new FormControl('');
  contentStatusFilter = new FormControl('');
  displayedColumns: string[] = [
    'monthlyTrackerId',
    'organizationName',
    'postScheduleOn',
    'resourceName',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'contentInPost',
    'contentCaption',
    'contentStatus',
    'approvedon',
    'action'
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private operationsService: OperationsService,
    private dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.fetchApprovalRequests();
    // Apply column filters dynamically
    this.organizationFilter.valueChanges.subscribe(() => this.applyFilter());
    this.resourceFilter.valueChanges.subscribe(() => this.applyFilter());
    this.contentStatusFilter.valueChanges.subscribe(() => this.applyFilter());
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }

  fetchApprovalRequests(): void {
    this.showSpinner = true;
    const userId = parseInt(localStorage.getItem('UserID') || '1', 10);
    const selectedDate = this.date.value?.format('YYYY-MM') || moment().format('YYYY-MM');
    this.operationsService.contentApprovalHistory(userId, `${selectedDate}-01`).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          contentStatus: this.getStatusText(item.contentStatus),
          monthlyTrackerId:item.monthlyTrackerId,
          userId:userId,
          creativeType:1,
          creativeTypeId:item.creativeType,
          promotionType:this.getpromotionType(item.promotionId),
          role:'Content Writer',
        }));
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error fetching approval requests:', error);
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
  applyFilter(): void {
    const organization = this.organizationFilter.value?.toLowerCase() || '';
    const resource = this.resourceFilter.value?.toLowerCase() || '';
    const status = this.contentStatusFilter.value?.toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any) =>
      (!organization || data.organizationName?.toLowerCase().includes(organization)) &&
      (!resource || data.resourceName?.toLowerCase().includes(resource)) &&
      (!status || data.contentStatusText?.toLowerCase().includes(status));

    this.dataSource.filter = Math.random().toString(); // Trigger filter refresh
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
  // Helper method to map status numbers to text
  getStatusText(status: number): string {
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
      default:
        return 'Unknown status';
    }
  }
  

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchApprovalRequests();
  }

  onEdit(row: any): void {
    const dialogRef = this.dialog.open(EditStatusApprovalsComponent, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchApprovalRequests(); // Refresh table after edit
      }
    });
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
