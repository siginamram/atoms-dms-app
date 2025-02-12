import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-dma-dashboard',
  standalone: false,
  templateUrl: './dma-dashboard.component.html',
  styleUrls: ['./dma-dashboard.component.css'],
  providers: [provideMomentDateAdapter()],
})
export class DmaDashboardComponent implements OnInit {
  fromDate = new FormControl(moment()); // Default: Today’s Date
  toDate = new FormControl(moment());   // Default: Today’s Date
  userId: number = 0;
  showSpinner: boolean = false;
  filteredDeliverables = new MatTableDataSource<any>([]);
  clientData = new MatTableDataSource<any>([]);
  metrics: any = {}; // ✅ Fix for metrics property

  // Declare total properties
  totalPostersPending = 0;
  totalPostersPromoted = 0;
  totalGReelsPending = 0;
  totalGReelsPromoted = 0;
  totalEdReelsPending = 0;
  totalEdReelsPromoted = 0;
  totalYTVideosPending = 0;
  totalYTVideosPromoted = 0;

  deliverablesColumns: string[] = [
    'name',
    'total',
    'noOfPendingPosts',
    'noOfPromotedPosts',
    'noOfOnTimePosts',
    'noOfEarlyPosts',
    'noOfLatePosts',
    'noOfRejectedPosts',
  ];

  displayedColumns = [
    'clientName',
    'posterspending',
    'postersPromoted',
    'gReelspending',
    'gReelsPromoted',
    'edReelspending',
    'edReelsPromoted',
    'youtubeVideospending',
    'youtubeVideosPromoted',
  ];


  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.fromDate.valueChanges.subscribe(() => this.setFromAndToDate());
    this.toDate.valueChanges.subscribe(() => this.setFromAndToDate());
    this.route.queryParams.subscribe((params) => {
      const queryUserId = +params['userId'];
      this.userId = !isNaN(queryUserId) && queryUserId > 0 ? queryUserId : parseInt(localStorage.getItem('UserID') || '0', 10);
    });

    if (this.userId && this.userId > 0) {
      this.fetchDashboardData(); // Fetch data on page load
    } else {
      console.error('Invalid userId: Unable to fetch dashboard data');
    }
  }

  setFromAndToDate(): void {
    this.fetchDashboardData(); // Fetch data based on updated dates
  }

  fetchDashboardData(): void {
    this.showSpinner = true;

    // Format the selected dates
    const formattedFromDate = this.fromDate.value?.format('YYYY-MM-DD');
    const formattedToDate = this.toDate.value?.format('YYYY-MM-DD');

    // ✅ **Corrected API call with `fromDate` and `toDate`**
    this.dashboardService.GetDMADashboardByMonth(this.userId, formattedFromDate, formattedToDate).subscribe({
      next: (response) => {
        this.showSpinner = false;

        this.filteredDeliverables.data = response.deliverableStatus?.map((item: any) => ({
          name: item.creativeTypeName,
          total: item.noOfPendingPosts + item.noOfPromotedPosts,
          noOfPendingPosts: item.noOfPendingPosts,
          noOfPromotedPosts: item.noOfPromotedPosts,
          noOfOnTimePosts: item.noOfOnTimePosts,
          noOfEarlyPosts: item.noOfEarlyPosts,
          noOfLatePosts: item.noOfLatePosts,
          noOfRejectedPosts:item.noOfRejectedPosts,
          creativeTypeId: item.creativeTypeId,
        })) || [];

        this.metrics = {
          numberOfClients: response.dmaAdCampain?.totalClients || 0,
          totalAdClients: response.dmaAdCampain?.totalAdClients || 0,
          adCampaignsUpdated: response.dmaAdCampain?.adCampaignsUpdated || 0,
          adCampaignsToBeUpdated: response.dmaAdCampain?.totalAdAdCampaignsToBeUpdated || 0,
          budgetToBeSpent: response.dmaAdCampain?.budgetToBeSpent || 0,
          budgetSpent: response.dmaAdCampain?.budgetSpent || 0,
          adReach: response.dmaAdCampain?.noOfReach || 0,
          impressions: response.dmaAdCampain?.noOfImpressions || 0,
          profileVisits: response.dmaAdCampain?.noOfProfileVisits || 0,
          followers: response.dmaAdCampain?.noOfFollowers || 0,
          messages: response.dmaAdCampain?.noOfMessages || 0,
          leads: response.dmaAdCampain?.noOfLeads || 0,
        };

        this.clientData.data = response.dmaPromotionOverview?.map((item: any) => ({
          clientName: item.organizationName,
          posterspending: item.noOfPostersPromotPendig,
          postersPromoted: item.noOfPostersPromoted,
          gReelspending: item.noOfGDPromotPendig,
          gReelsPromoted: item.noOfGDPromoted,
          edReelspending: item.noOfEDPromotPendig,
          edReelsPromoted: item.noOfEDPromoted,
          youtubeVideospending: item.noOfYTPromotPendig,
          youtubeVideosPromoted: item.noOfYTPromoted,
        })) || [];

        // Calculate Totals
        this.totalPostersPending = this.clientData.data.reduce((sum, item) => sum + item.posterspending, 0);
        this.totalPostersPromoted = this.clientData.data.reduce((sum, item) => sum + item.postersPromoted, 0);
        this.totalGReelsPending = this.clientData.data.reduce((sum, item) => sum + item.gReelspending, 0);
        this.totalGReelsPromoted = this.clientData.data.reduce((sum, item) => sum + item.gReelsPromoted, 0);
        this.totalEdReelsPending = this.clientData.data.reduce((sum, item) => sum + item.edReelspending, 0);
        this.totalEdReelsPromoted = this.clientData.data.reduce((sum, item) => sum + item.edReelsPromoted, 0);
        this.totalYTVideosPending = this.clientData.data.reduce((sum, item) => sum + item.youtubeVideospending, 0);
        this.totalYTVideosPromoted = this.clientData.data.reduce((sum, item) => sum + item.youtubeVideosPromoted, 0);
         
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error fetching DMA Dashboard data:', error);
      },
    });
  }

  editRow(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-pending-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
      },
    });
  }

  editRownew(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
      },
    });
  }

  early(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
        postStatus: 2,
      },
    });
  }

  OnTime(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
        postStatus: 3,
      },
    });
  }

  Late(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
        postStatus: 4,
      },
    });
  }

  Rejected(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: this.fromDate.value?.format('YYYY-MM-DD'),
        toDateValue: this.toDate.value?.format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
        postStatus: 5,
      },
    });
  }
}
