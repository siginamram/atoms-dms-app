import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-youtube-videos-dashboard',
  standalone:false,
  templateUrl: './youtube-videos-dashboard.component.html',
  styleUrls: ['./youtube-videos-dashboard.component.css'],
})
export class YoutubeVideosDashboardComponent implements OnInit {
  showSpinner: boolean = false;
  kpis: any[] = [];
  graphs: any[] = [];
  clientWiseData: any[] = [];
  roleId: number = 0; // Default Role ID
  name:any;
  empname:any; 
  fromDate = new FormControl(moment().startOf('month').format('YYYY-MM-DD')); // First day of current month
  toDate = new FormControl(moment().endOf('month').format('YYYY-MM-DD')); // Last day of current month
  userId: number = 0;
  creativeTypeId: number = 3; // YouTube Video Creative Type

  totals = {
    noOfRequiredVideos: 0,
    totalVideosEdited: 0,
    totalVideosApproved: 0,
    totalPendingApprovals: 0,
    totalPendingVideos: 0,
    totalChangesRecommended: 0,
  };

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = +params['userId'] || parseInt(localStorage.getItem('UserID') || '0', 10);
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.roleId = +params['roleid'] || 0;
      this.name = params['name'];
      this.empname = params['empname'] || localStorage.getItem('firstName');
    });

    // ✅ Fetch data when the component initializes
    this.fetchDashboardData();

    // ✅ Automatically fetch data when dates are changed
    this.fromDate.valueChanges.subscribe(() => this.updateDateFilters());
    this.toDate.valueChanges.subscribe(() => this.updateDateFilters());
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

    this.dashboardService.GetVideoEditorDashboardByMonth(this.userId, fdate, tdate, 3).subscribe(
      (data: any) => {
        this.showSpinner = false;
        if (data) {
          this.updateKPI(data.videoEditorMonthlyTask);
          this.updateGraphs(data.videoEditorDayTrackers);
          this.clientWiseData = data.clientWiseMonthlyVideoEditorTrackers || [];
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
      { title: 'YouTube Videos Designed', value: kpiData.totalVideosEdited, icon: 'photo_library', color: '#2196F3' },
      { title: 'Pending YouTube Videos', value: kpiData.pendingVideos, icon: 'hourglass_empty', color: '#FF7043' },
      { title: 'Changes Recommended', value: kpiData.totalChangesRecommended, icon: 'edit', color: '#FF5722' },
      { title: 'Approved YouTube Videos', value: kpiData.totalApprovedVideos, icon: 'check_circle', color: '#8BC34A' },
      { title: 'Pending Approvals from Lead', value: kpiData.totalManagerApprovalPending, icon: 'supervisor_account', color: '#FFC107' },
      { title: 'Pending Approvals from Client', value: kpiData.totalClientApprovalPending, icon: 'how_to_reg', color: '#FF9800' },
      { title: 'Total Pending YouTube Videos', value: kpiData.totalVideosPending, icon: 'hourglass_empty', color: '#FF7043' },
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
          creativeTypeId: 3,
          status:4,
        },
      });
   }
  else if(lead.title=='Pending YouTube Videos' && lead.value != 0){
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/posts-pending'], {
      queryParams: {
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: 3,
        status:1,
      },
    });
  }
}

  updateGraphs(dayTrackerData: any[]): void {
    const labels = dayTrackerData.map((item) => moment(item.day).format('DD'));
    const dataPoints = dayTrackerData.map((item) => item.totalVideosEdited);

    this.graphs = [
      {
        title: 'YouTube Videos Over Time',
        labels,
        data: {
          datasets: [
            {
              label: 'YouTube Videos',
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
        acc.noOfRequiredVideos += row.noOfRequiredVideos || 0;
        acc.totalVideosEdited += row.totalVideosEdited || 0;
        acc.totalVideosApproved += row.totalVideosApproved || 0;
        acc.totalPendingApprovals += row.totalPendingApprovals || 0;
        acc.totalPendingVideos += row.totalPendingVideos || 0;
        acc.totalChangesRecommended += row.totalChangesRecommended || 0;
        return acc;
      },
      {
        noOfRequiredVideos: 0,
        totalVideosEdited: 0,
        totalVideosApproved: 0,
        totalPendingApprovals: 0,
        totalPendingVideos: 0,
        totalChangesRecommended: 0,
      }
    );
  }
  goBack(): void {
    //this.router.navigate(['/home/dashboard/resource-list']); 
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
         roleid:12,
         creativeTypeId:this.creativeTypeId,
         name:this.name,
        }
      });
  }
    editRow(lead: any): void {
      const userId = +localStorage.getItem('UserID')!;
      this.router.navigate(['/home/dashboard/posts-pending'], {
        queryParams: {
          fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
          toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
          userId: userId,
          creativeTypeId: lead.creativeTypeId,
        },
      });
    }
}
