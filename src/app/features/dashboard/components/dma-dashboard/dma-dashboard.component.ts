import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-dma-dashboard',
  standalone: false,
  templateUrl: './dma-dashboard.component.html',
  styleUrls: ['./dma-dashboard.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class DmaDashboardComponent implements OnInit {
  date = new FormControl(moment()); // Default to current month and year
  userId: number = 0;
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
  ];
  filteredDeliverables = new MatTableDataSource<any>([]);
  metrics: any = {};
  clientData = new MatTableDataSource<any>([]);
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

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchDashboardData(); // Fetch data on month/year change
  }

  fetchDashboardData(): void {
    const formattedDate =  this.date.value?.format('YYYY-MM') + '-01';
   // this.userId = parseInt(localStorage.getItem('UserID') || '0', 10);

    this.dashboardService.GetDMADashboardByMonth(this.userId, formattedDate).subscribe({
      next: (response) => {
        if (response) {
          // Populate Deliverable Status Data
          this.filteredDeliverables.data = response.deliverableStatus.map((item: any) => ({
            name: item.creativeTypeName,
            total: item.noOfPendingPosts + item.noOfPromotedPosts,
            noOfPendingPosts: item.noOfPendingPosts,
            noOfPromotedPosts: item.noOfPromotedPosts,
            noOfOnTimePosts: item.noOfOnTimePosts,
            noOfEarlyPosts: item.noOfEarlyPosts,
            noOfLatePosts: item.noOfLatePosts,
          }));

          // Populate Metrics
          this.metrics = {
            numberOfClients: response.dmaAdCampain.totalClients,
            adCampaignsUpdated: response.dmaAdCampain.adCampaignsUpdated,
            adCampaignsToBeUpdated: response.dmaAdCampain.totalAdAdCampaignsToBeUpdated,
            budgetToBeSpent: response.dmaAdCampain.budgetToBeSpent,
            budgetSpent: response.dmaAdCampain.budgetSpent,
            adReach: response.dmaAdCampain.noOfReach,
            impressions: response.dmaAdCampain.noOfImpressions,
            profileVisits: response.dmaAdCampain.noOfProfileVisits,
            followers: response.dmaAdCampain.noOfFollowers,
            messages: response.dmaAdCampain.noOfMessages,
            leads: response.dmaAdCampain.noOfLeads,
          };

          this.clientData.data = response.dmaPromotionOverview.map((item: any) => ({
            clientName: item.organizationName,
            posterspending: item.noOfPostersPromotPendig,
            postersPromoted: item.noOfPostersPromoted,
            gReelspending: item.noOfGDPromotPendig,
            gReelsPromoted: item.noOfGDPromoted,
            edReelspending: item.noOfEDPromotPendig,
            edReelsPromoted: item.noOfEDPromoted,
            youtubeVideospending: item.noOfYTPromotPendig,
            youtubeVideosPromoted: item.noOfYTPromoted,
          }));
          
          // Calculate Totals
          this.totalPostersPending = this.clientData.data.reduce((sum, item) => sum + item.posterspending, 0);
          this.totalPostersPromoted = this.clientData.data.reduce((sum, item) => sum + item.postersPromoted, 0);
          this.totalGReelsPending = this.clientData.data.reduce((sum, item) => sum + item.gReelspending, 0);
          this.totalGReelsPromoted = this.clientData.data.reduce((sum, item) => sum + item.gReelsPromoted, 0);
          this.totalEdReelsPending = this.clientData.data.reduce((sum, item) => sum + item.edReelspending, 0);
          this.totalEdReelsPromoted = this.clientData.data.reduce((sum, item) => sum + item.edReelsPromoted, 0);
          this.totalYTVideosPending = this.clientData.data.reduce((sum, item) => sum + item.youtubeVideospending, 0);
          this.totalYTVideosPromoted = this.clientData.data.reduce((sum, item) => sum + item.youtubeVideosPromoted, 0);
          
        }
      },
      error: (error) => {
        console.error('Error fetching DMA Dashboard data:', error);
      },
    });
  }
}
