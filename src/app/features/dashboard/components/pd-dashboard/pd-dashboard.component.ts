import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pd-dashboard',
  standalone:false,
  templateUrl: './pd-dashboard.component.html',
  styleUrls: ['./pd-dashboard.component.css'],
})
export class PdDashboardComponent implements OnInit {
  showSpinner: boolean = false;
  kpis: any[] = [];
  graphs: any[] = [];
  clientWiseData: any[] = [];
  creativeTypeId: any = 0; // Default creative type ID
  roleId: number = 0; // Default Role ID
  name:any;
  empname:any; 


  fromDate = new FormControl(moment().startOf('month').format('YYYY-MM-DD')); // First day of current month
  toDate = new FormControl(moment().endOf('month').format('YYYY-MM-DD')); // Last day of current month
  userId: number = 0;
  
  totals = {
    noOfRequiredPosters: 0,
    totalPostersDesigned: 0,
    totalPostersApproved: 0,
    totalPendingApprovals: 0,
    totalPendingContent: 0,
    totalChangesRecommended: 0,
  };

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = +params['userId'] || parseInt(localStorage.getItem('UserID') || '0', 10);
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.roleId = +params['roleid'] || 0;
      this.name = params['name'];
      this.empname = params['empname'] || localStorage.getItem('firstName')
    });

    // ✅ Automatically call fetchDashboardData when date filters change
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

    this.dashboardService.GetPosterDesignerDashboardByUser(this.userId, fdate, tdate).subscribe(
      (data: any) => {
        this.showSpinner = false;
        if (data) {
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
      { title: 'Total Clients', value: kpiData.totalClients, icon: 'groups', color: '#4CAF50' },
      { title: 'Posters Designed', value: kpiData.totalPostersDesigned, icon: 'photo_library', color: '#2196F3' },
      { title: 'Approved Posters', value: kpiData.totalApprovedPosters, icon: 'check_circle', color: '#8BC34A' },
      { title: 'Lead Approvals Pending', value: kpiData.totalManagerApprovalPending, icon: 'supervisor_account', color: '#FFC107' },
      { title: 'Client Approvals Pending', value: kpiData.totalClientApprovalPending, icon: 'how_to_reg', color: '#FF9800' },
      { title: 'Changes Recommended', value: kpiData.totalChangesRecommended, icon: 'edit', color: '#FF5722' },
      { title: 'Total Posters Pending', value: kpiData.totalPostersPending, icon: 'hourglass_empty', color: '#2196F3' },
      { title: 'Design Pending Posters', value: kpiData.pendingPosters, icon: 'hourglass_empty', color: '#FF7043' },

    ];
  }

  getRow(lead: any): void {
    console.log(lead);
 
    if(lead.title=='Changes Recommended' && lead.value != 0){
      const userId = +localStorage.getItem('UserID')!;
      this.router.navigate(['/home/dashboard/posts-pending'], {
        queryParams: {
          fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
          toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
          userId: userId,
          creativeTypeId: 1,
          status:4,
        },
      });
   }
  else if(lead.title=='Design Pending Posters' && lead.value != 0){
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/posts-pending'], {
      queryParams: {
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: 1,
        status:1,
      },
    });

  }

  }
  
  updateGraphs(dayTrackerData: any[]): void {
    const labels = dayTrackerData.map((item) => moment(item.day).format('DD'));
    const dataPoints = dayTrackerData.map((item) => item.totalPostersDesigned);

    this.graphs = [
      {
        title: 'Posters Designed Over Time',
        labels,
        data: {
          datasets: [
            {
              label: 'Posters Designed',
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
  goBack(): void {
    //this.router.navigate(['/home/dashboard/resource-list']); 
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
         roleid:11,
         creativeTypeId:this.creativeTypeId,
         name:this.name,
        }
      });
  }
  
}
