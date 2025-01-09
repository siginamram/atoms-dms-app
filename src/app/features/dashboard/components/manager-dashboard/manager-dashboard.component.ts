import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-dashboard',
  standalone:false,
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent {
  kpis = [
    { title: 'Number of Clients', value: 20 },
    { title: 'Number of Team Leads', value: 15 },
    { title: 'Number of Content Writers', value: 25 },
    { title: 'Number of Poster Designers', value: 18 },
    { title: 'Number of Video Editors', value: 12 },
  ];

  graphs = [
    {
      title: 'Total No. of Content Written',
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [
        { data: [10, 20, 30, 40, 50], label: 'Content Written', borderColor: 'blue', fill: false },
      ],
    },
    {
      title: 'Total No. of Poster Designs',
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [
        { data: [15, 25, 35, 45, 55], label: 'Poster Designs', borderColor: 'green', fill: false },
      ],
    },
    {
      title: 'Total No. of Videos Edited',
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [
        { data: [5, 15, 25, 35, 45], label: 'Videos Edited', borderColor: 'red', fill: false },
      ],
    },
  ];
  
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Correctly typed legend position
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
  
  
  
  salaryDetails = [
    { type: 'Salary', amount: '₹30000' },
    { type: 'Leave Deductions', amount: '₹200' },
    { type: 'PF Allowances', amount: '₹100' },
    { type: 'Tax Deductions', amount: '₹150' },
    { type: 'Net Salary', amount: '₹29550' },
  ];
  
}
