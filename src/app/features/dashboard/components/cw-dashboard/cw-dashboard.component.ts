import { Component, OnInit} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { ChartOptions } from 'chart.js';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cw-dashboard',
  standalone: false,
  templateUrl: './cw-dashboard.component.html',
  styleUrls: ['./cw-dashboard.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class CwDashboardComponent implements OnInit {
  showSpinner: boolean = false; // Default value
  kpis: any[] = [];
  graphs: any[] = [];
  clientWiseData: any[] = [];
  date = new FormControl(moment()); // Default to current month and year
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); // Get userId from local storage
  totals = {
    noOfRequiredContent: 0,
    totalContentWritten: 0,
    totalContentApproved: 0,
    totalPendingApprovals: 0,
    totalPendingContent: 0,
  };
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchDashboardData(); // Fetch data on page load
  }

  fetchDashboardData(): void {
    this.showSpinner = true;
    const selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-01
    this.dashboardService
      .GetcontentDashboardByUser(this.userId, selectedDate)
      .subscribe(
        (data: any) => {
          if (data) {
            this.showSpinner = false;
            this.updateKPI(data.contentWritterMonthlyTask);
            this.updateGraphs(data.contentWriterDayTrackers);
            this.clientWiseData = data.clientWiseMonthlyContentTracker || [];
            this.calculateTotals();
          }
        },
        (error) => {
          this.showSpinner = false;
          console.error('Error fetching data:', error);
        }
      );
  }

  updateKPI(kpiData: any): void {
    this.kpis = [
      {
        title: 'Number of Clients',
        value: kpiData.totalClients,
        icon: 'groups', // Group of people icon
        color: '#4CAF50', // Green for success/positive numbers
      },
      {
        title: 'Content  Written',
        value: kpiData.totalContentWritten,
        icon: 'edit_note', // Edit icon
        color: '#2196F3', // Blue for productivity
      },
      {
        title: 'Approved Content',
        value: kpiData.totalApprovedContent,
        icon: 'check_circle', // Check circle for approvals
        color: '#8BC34A', // Light green for approvals
      },
      {
        title: 'Lead Approvals Pending',
        value: kpiData.totalManagerApprovalPending,
        icon: 'supervisor_account', // Manager icon
        color: '#FFC107', // Yellow for pending/attention
      },
      {
        title: 'Client Approvals Pending',
        value: kpiData.totalClientApprovalPending,
        icon: 'how_to_reg', // Person with a checkmark icon for client approval
        color: '#FF9800', // Orange for client-related KPIs
      },
      {
        title: 'Changes Recommended',
        value: kpiData.totalChangesRecommended,
        icon: 'edit', // Edit/Change icon
        color: '#FF5722', // Red-Orange for action items
      },
      {
        title: 'Total Content Pending',
        value: kpiData.totalContentPending,
        icon: 'hourglass_empty', // Hourglass for pending work
        color: '#FF7043', // Bright red-orange for pending tasks
      },
    ];
  }
  

  updateGraphs(dayTrackerData: any[]): void {
    const labels = dayTrackerData.map((item) =>
      moment(item.day).format('DD')
    );
    const dataPoints = dayTrackerData.map((item) => item.totalContentWritten);

    this.graphs = [
      {
        title: 'Content Written Over Time',
        labels,
        data: {
          datasets: [
            {
              label: 'Content Written',
              data: dataPoints,
              borderColor: '#007BFF',
              fill: false,
            },
          ],
          labels,
        },
      },
    ];
  }

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
  calculateTotals(): void {
    this.totals = this.clientWiseData.reduce(
      (acc, row) => {
        acc.noOfRequiredContent += row.noOfRequiredContent || 0;
        acc.totalContentWritten += row.totalContentWritten || 0;
        acc.totalContentApproved += row.totalContentApproved || 0;
        acc.totalPendingApprovals += row.totalPendingApprovals || 0;
        acc.totalPendingContent += row.totalPendingContent || 0;
        return acc;
      },
      {
        noOfRequiredContent: 0,
        totalContentWritten: 0,
        totalContentApproved: 0,
        totalPendingApprovals: 0,
        totalPendingContent: 0,
      }
    );
  }
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchDashboardData(); // Fetch data on month/year change
  }
}
