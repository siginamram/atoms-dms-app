import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-cw-dashboard',
  standalone: false,
  templateUrl: './cw-dashboard.component.html',
  styleUrls: ['./cw-dashboard.component.css'],
})
export class CwDashboardComponent {
 // Top Section Data
 kpis = [
  { title: 'Number of Clients', value: 20, icon: 'group', color: '#4CAF50' },
  { title: 'No. of Days of Content Written', value: 25, icon: 'edit', color: '#2196F3' },
  { title: 'No. of Pending Content', value: 25, icon: 'hourglass_empty', color: '#FFC107' },
  { title: 'No. of Contents Approved', value: 120, icon: 'check_circle', color: '#8BC34A' },
  { title: 'No. of Contents to be Approval', value: 80, icon: 'pending', color: '#FF5722' },
];

graphs = [
  {
    title: 'Total No. of Content Written',
    labels: ['01', '02', '03', '04', '05', '06', '07'],
    data: {
      datasets: [
        {
          label: 'Content Written',
          data: [10, 20, 30, 25, 40, 35, 50],
          borderColor: '#007BFF',
          fill: false,
        },
      ],
      labels: ['01', '02', '03', '04', '05', '06', '07'],
    },
  },

];

chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

tableData = [
  { name: 'John Doe', actualContent: 50, contentWritten: 40, contentApproved: 30, pendingApprovals: 5, pendingContents: 10 },
  { name: 'Jane Smith', actualContent: 70, contentWritten: 60, contentApproved: 55, pendingApprovals: 10, pendingContents: 15 },
  { name: 'Chris Johnson', actualContent: 80, contentWritten: 70, contentApproved: 65, pendingApprovals: 8, pendingContents: 12 },
];

fromDate: string = '';
toDate: string = '';

applyDateFilter() {
  console.log('From Date:', this.fromDate);
  console.log('To Date:', this.toDate);
  // Add filtering logic here
}
}