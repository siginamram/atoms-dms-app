import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cw-dashboard',
  standalone: false,
  templateUrl: './cw-dashboard.component.html',
  styleUrls: ['./cw-dashboard.component.css'],
})
export class CwDashboardComponent implements OnInit {
  showSpinner: boolean = false;
  kpis: any[] = [];
  graphs: any[] = [];
  clientWiseData: any[] = [];

  fromDate = new FormControl(moment().startOf('month')); // Default: First day of month
  toDate = new FormControl(moment().endOf('month')); // Default: Last day of month
  userId: number = 0;

  totals = {
    noOfRequiredContent: 0,
    totalContentWritten: 0,
    totalContentApproved: 0,
    totalPendingApprovals: 0,
    totalPendingContent: 0,
    totalChangesRecommended: 0,
  };

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = +params['userId'] || parseInt(localStorage.getItem('UserID') || '0', 10);
    });

    // ✅ Automatically update API when date changes
    this.fromDate.valueChanges.subscribe(() => this.updateDateFilters());
    this.toDate.valueChanges.subscribe(() => this.updateDateFilters());

    if (this.userId > 0) {
      this.fetchDashboardData();
    } else {
      console.error('Invalid userId: Unable to fetch dashboard data');
    }
  }

  updateDateFilters(): void {
    if (!this.fromDate.value || !this.toDate.value) {
      console.warn("⚠️ Both From and To dates are required!");
      return;
    }

    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');

    if (moment(fdate).isAfter(moment(tdate))) {
      console.warn("⚠️ 'From Date' cannot be after 'To Date'!");
      return;
    }

    console.log(`📅 Fetching data for: From ${fdate} → To ${tdate}`);
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.showSpinner = true;
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');

    this.dashboardService.GetcontentDashboardByUser(this.userId, fdate, tdate).subscribe(
      (data: any) => {
        this.showSpinner = false;
        if (data) {
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
      { title: 'Total Clients', value: kpiData.totalClients, icon: 'groups', color: '#4CAF50' },
      { title: 'Content Written', value: kpiData.totalContentWritten, icon: 'edit_note', color: '#2196F3' },
      { title: 'Approved Content', value: kpiData.totalApprovedContent, icon: 'check_circle', color: '#8BC34A' },
      { title: 'Lead Approvals Pending', value: kpiData.totalManagerApprovalPending, icon: 'supervisor_account', color: '#FFC107' },
      { title: 'Client Approvals Pending', value: kpiData.totalClientApprovalPending, icon: 'how_to_reg', color: '#FF9800' },
      { title: 'Changes Recommended', value: kpiData.totalChangesRecommended, icon: 'edit', color: '#FF5722' },
      { title: 'Total Content Pending', value: kpiData.totalContentPending, icon: 'hourglass_empty', color: '#FF7043' },
    ];
  }

  updateGraphs(dayTrackerData: any[]): void {
    const labels = dayTrackerData.map((item) => moment(item.day).format('DD'));
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
    plugins: { legend: { display: true, position: 'top' } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
  };

  calculateTotals(): void {
    this.totals = this.clientWiseData.reduce(
      (acc, row) => {
        acc.noOfRequiredContent += row.noOfRequiredContent || 0;
        acc.totalContentWritten += row.totalContentWritten || 0;
        acc.totalContentApproved += row.totalContentApproved || 0;
        acc.totalPendingApprovals += row.totalPendingApprovals || 0;
        acc.totalPendingContent += row.totalPendingContent || 0;
        acc.totalChangesRecommended += row.totalChangesRecommended || 0;
        return acc;
      },
      {
        noOfRequiredContent: 0,
        totalContentWritten: 0,
        totalContentApproved: 0,
        totalPendingApprovals: 0,
        totalPendingContent: 0,
        totalChangesRecommended: 0,
      }
    );
  }
}
