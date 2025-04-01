import { Component } from '@angular/core';

@Component({
  selector: 'app-sl-dashboard',
  standalone: false,
  templateUrl: './sl-dashboard.component.html',
  styleUrls: ['./sl-dashboard.component.css']
})
export class SlDashboardComponent {
  kpis = [
    { title: 'No.of Sales Associates', value: 20, icon: 'group', color: '#4CAF50' }, // Green
    { title: 'No.of Prospects Registered', value: 20, icon: 'assignment', color: '#2196F3' }, // Blue
    { title: 'No.of Meetings Scheduled', value: 20, icon: 'schedule', color: '#FFC107' }, // Amber
    { title: 'No.of Meetings Completed', value: 20, icon: 'done_all', color: '#8BC34A' }, // Light Green
    { title: 'No.of Upcoming Meetings', value: 20, icon: 'event', color: '#FF9800' }, // Orange
    { title: 'No.of Rejected Prospects', value: 20, icon: 'cancel', color: '#F44336' }, // Red
    { title: 'No.of Deals Closed', value: 20, icon: 'monetization_on', color: '#9C27B0' }, // Purple
    { title: 'Team Success Rate', value: '85%', icon: 'trending_up', color: '#00BCD4' }, // Cyan
    { title: 'Revenue Generated', value: '7,20,000', icon: 'attach_money', color: '#673AB7' } // Deep Purple
  ];
  

  tableData = [
    { name: 'John Doe', prospects: 15, dealsClosed: 8, revenue: '2,50,000', successRate: '80%' },
    { name: 'Jane Smith', prospects: 12, dealsClosed: 6, revenue: '1,80,000', successRate: '70%' },
    { name: 'Chris Johnson', prospects: 10, dealsClosed: 5, revenue: '1,50,000', successRate: '75%' },
    { name: 'Patricia Brown', prospects: 20, dealsClosed: 10, revenue: '3,00,000', successRate: '85%' }
  ];

  fromDate: string = '';
  toDate: string = '';

  applyDateFilter() {
    console.log('From Date:', this.fromDate);
    console.log('To Date:', this.toDate);
    // Add filtering logic here
  }
}
