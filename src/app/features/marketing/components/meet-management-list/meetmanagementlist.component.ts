import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-meetmanagementlist',
  templateUrl: './meetmanagementlist.component.html',
  styleUrls: ['./meetmanagementlist.component.css'],
})
export class MeetmanagementlistComponent implements OnInit {
  activeTab: 'upcoming' | 'tentative' = 'upcoming'; // Default tab
  displayedColumns: string[] = ['meetID', 'leadName', 'date', 'time', 'insight', 'actions'];
  dataSource = new MatTableDataSource<any>(); // Data source for Material Table

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator

  constructor(private router: Router, private marketingService: MarketingService) {}

  ngOnInit(): void {
    this.loadUpcomingMeetings();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }

  // Load upcoming meetings from API
  loadUpcomingMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    this.marketingService.getMeetingsByUser(userId).subscribe(
      (data: any) => {
        console.log('Fetched Upcoming Meetings:', data);
        this.dataSource.data = data; // Bind API data to MatTableDataSource
      },
      (error) => {
        console.error('Failed to fetch upcoming meetings:', error);
        this.dataSource.data = []; // Clear data on error
      }
    );
  }

  // Switch Tabs
  switchTab(tab: 'upcoming' | 'tentative'): void {
    this.activeTab = tab;

    if (tab === 'tentative') {
      this.loadTentativeMeetings();
    }
  }

  // Load tentative meetings from API
  loadTentativeMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    // this.marketingService.getTentativeMeetingsByUser(userId).subscribe(
    //   (data: any) => {
    //     console.log('Fetched Tentative Meetings:', data);
    //     this.dataSource.data = data; // Bind API data to MatTableDataSource
    //   },
    //   (error) => {
    //     console.error('Failed to fetch tentative meetings:', error);
    //     this.dataSource.data = [];
    //   }
    // );
  }

  // Navigate to Schedule Meet page
  Schedule(): void {
    this.router.navigate(['/home/marketing/meet-popup']);
  }

  // Navigate to Edit Meet page
  editMeet(row: any): void {
    console.log('Editing meet with ID:', row.meetID);
    this.router.navigate(['/home/marketing/add-meet', row.meetID]);
  }
}
