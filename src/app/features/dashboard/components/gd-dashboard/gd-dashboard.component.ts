import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { ChartOptions } from 'chart.js';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-gd-dashboard',
  standalone:false,
  templateUrl: './gd-dashboard.component.html',
  styleUrl: './gd-dashboard.component.css',
   providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class GdDashboardComponent implements OnInit {
  showSpinner: boolean = false;
  kpis: any[] = [];
  graphs: any[] = [];
  clientWiseData: any[] = [];
  date = new FormControl(moment());
  userId: number = 0;
  
  totals = {
    noOfRequiredPosters: 0,
    totalPostersDesigned: 0,
    totalPostersApproved: 0,
    totalPendingApprovals: 0,
    totalPendingContent: 0,
    totalChangesRecommended: 0,
  };

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Check if `userId` exists in query params and is a valid number
      const queryUserId = +params['userId'];
      if (!isNaN(queryUserId) && queryUserId > 0) {
        this.userId = queryUserId;
      } else {
        // Fallback to `localStorage` if `userId` is not present or invalid
        this.userId = parseInt(localStorage.getItem('UserID') || '0', 10);
      }
    });
  
    // Ensure `userId` is valid before fetching data
    if (this.userId && this.userId > 0) {
      this.fetchDashboardData(); // Fetch data on page load
    } else {
      console.error('Invalid userId: Unable to fetch dashboard data');
    }
  }

  fetchDashboardData(): void {
    this.showSpinner = true;
    const selectedDate = this.date.value?.format('YYYY-MM') + '-01';

    this.dashboardService
      .GetGraphicDesignerDashboardByMonth(this.userId, selectedDate)
      .subscribe(
        (data: any) => {
          if (data) {
            this.showSpinner = false;
            this.updateKPI(data.posterDesignerMonthlyTask);
            this.updateGraphs(data.posterDesignerDayTrackers);
            this.clientWiseData = data.clientWiseMonthlyPosterDesignerTrackers || [];
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
        title: 'Total Clients',
        value: kpiData.totalClients,
        icon: 'groups',
        color: '#4CAF50',
      },
      {
        title: 'Graphic Videos Designed',
        value: kpiData.totalPostersDesigned,
        icon: 'photo_library',
        color: '#2196F3',
      },
      {
        title: 'Approved Graphic Videos',
        value: kpiData.totalApprovedPosters,
        icon: 'check_circle',
        color: '#8BC34A',
      },
      {
        title: 'Lead Approvals Pending',
        value: kpiData.totalManagerApprovalPending,
        icon: 'supervisor_account',
        color: '#FFC107',
      },
      {
        title: 'Client Approvals Pending',
        value: kpiData.totalClientApprovalPending,
        icon: 'how_to_reg',
        color: '#FF9800',
      },
      {
        title: 'Changes Recommended',
        value: kpiData.totalChangesRecommended,
        icon: 'edit',
        color: '#FF5722',
      },
      {
        title: 'Total Graphic Videos Pending',
        value: kpiData.totalPostersPending,
        icon: 'hourglass_empty',
        color: '#FF7043',
      },
    ];
  }

  updateGraphs(dayTrackerData: any[]): void {
    const labels = dayTrackerData.map((item) =>
      moment(item.day).format('DD')
    );
    const dataPoints = dayTrackerData.map((item) => item.totalPostersDesigned);

    this.graphs = [
      {
        title: 'Graphic Videos Designed Over Time',
        labels,
        data: {
          datasets: [
            {
              label: 'Graphic Videos Designed',
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
        acc.noOfRequiredPosters += row.noOfRequiredPosters || 0;
        acc.totalPostersDesigned += row.totalPostersDesigned || 0;
        acc.totalPostersApproved += row.totalPostersApproved || 0;
        acc.totalPendingApprovals += row.totalPendingApprovals || 0;
        acc.totalPendingContent += row.totalPendingContent || 0;
        acc.totalChangesRecommended += row.totalChangesRecommended || 0;
        return acc;
      },
      {
        noOfRequiredPosters: 0,
        totalPostersDesigned: 0,
        totalPostersApproved: 0,
        totalPendingApprovals: 0,
        totalPendingContent: 0,
        totalChangesRecommended: 0,
      }
    );
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchDashboardData();
  }
}
