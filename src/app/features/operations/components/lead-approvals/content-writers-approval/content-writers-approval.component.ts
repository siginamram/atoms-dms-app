import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { OperationsService } from '../../../services/operations.service'; 
import { MatDialog } from '@angular/material/dialog';
import { EditStatusApprovalsComponent } from '../edit-status-approvals/edit-status-approvals.component';
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
  selector: 'app-content-writers-approval',
  standalone:false,
  templateUrl: './content-writers-approval.component.html',
  styleUrl: './content-writers-approval.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class ContentWritersApprovalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly date = new FormControl(moment());
  activeFilter: string | null = null;
  organizationFilter = new FormControl('');
  resourceFilter = new FormControl('');
  contentStatusFilter = new FormControl('');
  displayedColumns: string[] = [
    'monthlyTrackerId',
    'organizationName',
    'resourceName',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'contentInPost',
    'contentCaption',
    'contentStatus',
    'contentRemarks',
    'action',
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
    const userId = parseInt(localStorage.getItem('UserID') || '1', 10);
    const selectedDate = this.date.value?.format('YYYY-MM') || moment().format('YYYY-MM');
    this.operationsService.contentApprovalRequests(userId, `${selectedDate}-01`).subscribe({
      next: (response) => {
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          contentStatus: this.getStatusText(item.contentStatus),
          monthlyTrackerId:item.monthlyTrackerId,
          userId:userId,
          creativeType:1,
          role:'Content Writer',
        }));
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching approval requests:', error);
      },
    });
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
}
