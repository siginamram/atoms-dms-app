import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cw-dashboard',
  standalone: false,
  templateUrl: './cw-dashboard.component.html',
  styleUrls: ['./cw-dashboard.component.css'],
})
export class CwDashboardComponent {
  // Top Section Data
  kpis = [
    { title: 'Number of Clients', value: 20 },
    { title: 'No. of Days of Content Written', value: 15 },
    { title: 'No. of Hours Work', value: 30 },
  ];

  // Graph Data
  graphs = [
    {
      title: 'Total No. of Content Written',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
          {
            label: 'Content Written',
            data: [10, 20, 30, 40, 50],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            fill: true,
          },
        ],
      },
    },
  ];

  // Chart Options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Fixed legend position type
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Notices Section
  notices = [
    'Meeting with the client at 11 AM.',
    'Submit content revisions by EOD.',
    'Monthly review scheduled for tomorrow.',
  ];

  // Salary Details Section
  salaryDetails = [
    { type: 'Salary', amount: '$3000' },
    { type: 'Leave Deductions', amount: '$200' },
    { type: 'PF Allowances', amount: '$100' },
    { type: 'Tax Deductions', amount: '$150' },
    { type: 'Net Salary', amount: '$2550' },
  ];

  selectedDate: Date | null = null;
}
