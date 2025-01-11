import { Component } from '@angular/core';

@Component({
  selector: 'app-sa-dashboard',
  standalone: false,
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.css'],
})
export class SaDashboardComponent {
  // Dummy KPI data
  kpis = [
    {
      title: 'No.of Prospects Registered',
      value: 20,
      icon: 'person_add',
      color: '#4CAF50',
    },
    {
      title: 'No.of Meetings Scheduled',
      value: 20,
      icon: 'event_available',
      color: '#2196F3',
    },
    {
      title: 'No.of Meetings Completed',
      value: 20,
      icon: 'check_circle',
      color: '#FF9800',
    },
    {
      title: 'No.of Upcoming Meetings',
      value: 20,
      icon: 'schedule',
      color: '#9C27B0',
    },
    {
      title: 'No.of Rejected Meets',
      value: 20,
      icon: 'cancel',
      color: '#F44336',
    },
    {
      title: 'No.of Deals Closed',
      value: 20,
      icon: 'handshake',
      color: '#8BC34A',
    },
    {
      title: 'No.of Success Rate',
      value: 20,
      icon: 'trending_up',
      color: '#3F51B5',
    },
    {
      title: 'Revenue Generated',
      value: '₹7,20,000',
      icon: 'attach_money',
      color: '#FFC107',
    },
  ];

  // Dummy table data
  clients = [
    {
      name: 'John Doe',
      dealDate: '2025-01-15',
      basePackage: '₹50,000',
      adBudget: '₹10,000',
      totalWorth: '₹60,000',
    },
    {
      name: 'Jane Smith',
      dealDate: '2025-01-20',
      basePackage: '₹70,000',
      adBudget: '₹20,000',
      totalWorth: '₹90,000',
    },
    {
      name: 'Mark Johnson',
      dealDate: '2025-01-25',
      basePackage: '₹40,000',
      adBudget: '₹15,000',
      totalWorth: '₹55,000',
    },
  ];
}
