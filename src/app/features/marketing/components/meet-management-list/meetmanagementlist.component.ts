import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetmanagementlist',
  templateUrl: './meetmanagementlist.component.html',
  styleUrl: './meetmanagementlist.component.css'
})
export class MeetmanagementlistComponent {
  constructor(private router: Router) {}
// Active Tab
activeTab: 'upcoming' | 'tentative' = 'upcoming';

// Column Definitions
displayedColumns: string[] = ['leadName', 'date', 'time', 'insight'];

// Sample Data for Upcoming
upcomingData = [
  { leadName: 'Tech Solutions', date: '2024-01-10', time: '10:00 AM', insight: 'Initial Meeting' },
  { leadName: 'Green Energy', date: '2024-01-12', time: '02:00 PM', insight: 'Follow-up' },
];

// Sample Data for Tentative
tentativeData = [
  { leadName: 'Future FinTech', date: '2024-01-15', time: '11:30 AM', insight: 'Proposal Discussion' },
  { leadName: 'Solar Innovations', date: '2024-01-18', time: '03:00 PM', insight: 'Feedback Discussion' },
];

// Switch Tabs
switchTab(tab: 'upcoming' | 'tentative') {
  this.activeTab = tab;
}
  // Navigate to Add Lead Page
  Schedule(): void {
    this.router.navigate(['/home/marketing/add-meet']);
  }
}
