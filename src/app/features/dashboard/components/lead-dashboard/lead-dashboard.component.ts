import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-lead-dashboard',
  standalone:false,
  templateUrl: './lead-dashboard.component.html',
  styleUrl: './lead-dashboard.component.css'
})
export class LeadDashboardComponent {

  kpis = [
    { title: 'Number of Clients', value: 20 },
    { title: 'No. of Unresolved Queries', value: 20 },
    { title: 'No. of Days of Content Written', value: 15 },
    { title: 'No. of Poster’s Designed', value: 15 },
    { title: 'No. of Video’s Edited', value: 15 },
    { title: 'No. of Pending Posts in Week', value: 15 },
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
    {
      title: 'Total No. of Poster’s Design',
      labels: ['01', '02', '03', '04', '05', '06', '07'],
      data: {
        datasets: [
          {
            label: 'Poster Designs',
            data: [15, 25, 35, 30, 45, 40, 55],
            borderColor: '#28A745',
            fill: false,
          },
        ],
        labels: ['01', '02', '03', '04', '05', '06', '07'],
      },
    },
    {
      title: 'Total No. of Video’s Edited',
      labels: ['01', '02', '03', '04', '05', '06', '07'],
      data: {
        datasets: [
          {
            label: 'Videos Edited',
            data: [5, 10, 15, 20, 25, 30, 35],
            borderColor: '#DC3545',
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

  salaryDetails = [
    { type: 'Salary', amount: '₹30000' },
    { type: 'Leave Deductions', amount: '₹200' },
    { type: 'PF Allowances', amount: '₹100' },
    { type: 'Tax Deductions', amount: '₹150' },
    { type: 'Net Salary', amount: '₹29550' },
  ];
}