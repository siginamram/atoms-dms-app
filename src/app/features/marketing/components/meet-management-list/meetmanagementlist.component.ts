import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-meetmanagementlist',
  standalone:false,
  templateUrl: './meetmanagementlist.component.html',
  styleUrls: ['./meetmanagementlist.component.css'],
})
export class MeetmanagementlistComponent implements OnInit, AfterViewInit {
  activeTab: 'upcoming' | 'tentative' = 'upcoming';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private marketingService: MarketingService,
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
      this.displayedColumns = ['meetID', 'leadName', 'date', 'time', 'insight', 'actions'];
      this.loadUpcomingMeetings();
    } else if (tab === 'tentative') {
      this.displayedColumns = ['meetID', 'leadName', 'actions'];
      this.loadTentativeMeetings();
    }
  }

  loadUpcomingMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    this.marketingService.getMeetingsByUser(userId).subscribe(
      (data: any) => {
        console.log('Fetched Upcoming Meetings:', data);
        this.dataSource.data = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Failed to fetch upcoming meetings:', error);
        this.dataSource.data = [];
      }
    );
  }

  loadTentativeMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    this.marketingService.getTentativeMeetingsByUser(userId).subscribe(
      (data: any) => {
        console.log('Fetched Tentative Meetings:', data);
        this.dataSource.data = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Failed to fetch tentative meetings:', error);
        this.dataSource.data = [];
      }
    );
  }

  Schedule(): void {
    this.router.navigate(['/home/marketing/meet-popup']);
  }

  editMeet(row: any): void {
    console.log('Editing meet with ID:', row.meetID);
    this.router.navigate(['/home/marketing/add-meet', row.meetID]);
  }
  editMeetten(row: any): void {
    console.log('Editing meet with ID:', row.meetID);
    this.router.navigate(['/home/marketing/meet-popup', row.meetID]);
  }
}
