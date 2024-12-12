import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-meetmanagementlist',
  templateUrl: './meetmanagementlist.component.html',
  styleUrls: ['./meetmanagementlist.component.css'],
})
export class MeetmanagementlistComponent implements OnInit {
  constructor(private router: Router, private commanApiService: MarketingService) {}

  activeTab: 'upcoming' | 'tentative' = 'upcoming'; // Default tab is Upcoming
  displayedColumns: string[] = ['meetID', 'leadName', 'date', 'time', 'insight', 'actions'];
  upcomingData: any[] = [];
  tentativeData: any[] = [];

  ngOnInit(): void {
    this.loadUpcomingMeetings();
  }

  // Load upcoming meetings from API
  loadUpcomingMeetings(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    this.commanApiService.getMeetingsByUser(userId).subscribe(
      (data: any) => {
        console.log('Fetched Upcoming Meetings:', data);
        this.upcomingData = data;
      },
      (error) => {
        console.error('Failed to fetch upcoming meetings:', error);
        this.upcomingData = [];
      }
    );
  }

  // Switch Tabs
  switchTab(tab: 'upcoming' | 'tentative') {
    this.activeTab = tab;
  }

  // Navigate to Schedule Meet page
  Schedule(): void {
    this.router.navigate(['/home/marketing/meet-popup']);
  }

  // Navigate to Edit Meet page
  editMeet(row: any): void {
    console.log('Editing meet:', row);
    this.router.navigate(['/home/marketing/add-meet'], { queryParams: { id: row.meetID } });
  }
  
}
