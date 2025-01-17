import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatTableDataSource } from '@angular/material/table';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { PhotoGrapherScheduleMeetPopupComponent } from '../photo-grapher-schedule-meet-popup/photo-grapher-schedule-meet-popup.component';
import * as moment from 'moment';
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
  selector: 'app-photo-grapher-schedule-meet',
  standalone:false,
  templateUrl: './photo-grapher-schedule-meet.component.html',
  styleUrl: './photo-grapher-schedule-meet.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrapherScheduleMeetComponent implements OnInit {
  activeTab: 'upcoming' | 'tentative' = 'upcoming';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  dateControl = new FormControl(moment()); // For filtering by date
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private OperationsService: OperationsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.switchTab(this.activeTab); // Initialize with the default tab
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  switchTab(tab: 'upcoming' | 'tentative'): void {
    this.activeTab = tab;
  
    if (tab === 'upcoming') {
      this.displayedColumns = [
        'id',
        'organizationName',
        'date',
        'time',
        'noOfYTVideos',
        'noOfEDReels',
        'meetingStatus',
        'remarks',
        'actions',
      ];
    } else if (tab === 'tentative') {
      this.displayedColumns = [
        'id',
        'organizationName',
        'date',
        'time',
        'noOfYouTubeVideos',
        'noOfEducationalReels',
        'actions',
    
      ];
    }
  
    this.fetchTableData();
  }
  
  fetchTableData(): void {
    const type = this.activeTab === 'upcoming' ? 1 : 2; // 1 for upcoming, 2 for tentative
  
    this.OperationsService.scheduleMeetingForShoot(type).subscribe({
      next: (response: any[]) => {
        console.log('Fetched Meetings:', response);
        this.dataSource.data = response.map((item, index) => ({
          id: index + 1, // Add serial number dynamically
          organizationName: item.organizationName || 'N/A', // Default if organizationName is missing
          date: moment(item.date).format('DD-MM-YYYY'), // Format date as DD-MM-YYYY
          time: item.time || 'Not Specified', // Default placeholder if time is missing
          noOfYouTubeVideos: item.noOfYouTubeVideos || 0, // Default to 0 if missing
          noOfEducationalReels: item.noOfEducationalReels || 0, // Default to 0 if missing
          shootLink: item.shootLink || 'N/A', // Default if shootLink is missing
          remarks: item.remarks || 'No remarks', // Default if remarks are missing
          meetingStatus: this.mapmeetingstatus(item.meetingStatus), // Status based on type
          meetId:item.id,
          clientId:item.clientId,
          shootDate:item.date,
        }));
        this.cdr.markForCheck(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.dataSource.data = []; // Clear table on error
      },
    });
  }
  mapmeetingstatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Scheduled',
      2: 'Rescheduled',
      3: 'Completed',
    };
    return statusMap[status] || 'Unknown Type';
  }

  Schedule(): void {
    const dialogRef = this.dialog.open(PhotoGrapherScheduleMeetPopupComponent, {
      width: '600px',
      data: {
        isEdit: false,
        meetingData: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Meet Scheduled:', result);
        this.fetchTableData(); // Refresh data
      }
    });
  }

  editMeetten(meet: any): void {
    const dialogRef = this.dialog.open(PhotoGrapherScheduleMeetPopupComponent, {
      width: '600px',
      data: {
        isEdit: true,
        meetingData: meet,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Meet Edited:', result);
        this.fetchTableData(); // Refresh data
      }
    });
  }
}