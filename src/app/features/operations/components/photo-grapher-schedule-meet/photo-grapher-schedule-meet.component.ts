import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-photo-grapher-schedule-meet',
  standalone:false,
  templateUrl: './photo-grapher-schedule-meet.component.html',
  styleUrl: './photo-grapher-schedule-meet.component.css'
})
export class PhotoGrapherScheduleMeetComponent implements OnInit, AfterViewInit {
  activeTab: 'upcoming' | 'tentative' = 'upcoming';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private OperationsService: OperationsService,
    private cdr: ChangeDetectorRef
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
      this.displayedColumns = ['id', 'organizationName', 'date', 'time','noOfYTVideos','noOfEDReels','shootLink','meetingStatus', 'remarks', 'actions'];
      this.loadUpcomingMeetings();
    } else if (tab === 'tentative') {
      this.displayedColumns = ['id', 'organizationName', 'date', 'time','noOfYTVideos','noOfEDReels','shootLink','meetingStatus', 'remarks', 'actions'];
      this.loadTentativeMeetings();
    }
  }

  loadUpcomingMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    // this.marketingService.getMeetingsByUser(userId).subscribe(
    //   (data: any) => {
    //     console.log('Fetched Upcoming Meetings:', data);
    //     this.dataSource.data = data;
    //     this.cdr.detectChanges();
    //   },
    //   (error) => {
    //     console.error('Failed to fetch upcoming meetings:', error);
    //     this.dataSource.data = [];
    //   }
    // );
  }

  loadTentativeMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    // this.marketingService.getTentativeMeetingsByUser(userId).subscribe(
    //   (data: any) => {
    //     console.log('Fetched Tentative Meetings:', data);
    //     this.dataSource.data = data;
    //     this.cdr.detectChanges();
    //   },
    //   (error) => {
    //     console.error('Failed to fetch tentative meetings:', error);
    //     this.dataSource.data = [];
    //   }
    // );
  }

  Schedule(): void {
   
  }

  editMeetten(row: any): void {
    
  }
}

