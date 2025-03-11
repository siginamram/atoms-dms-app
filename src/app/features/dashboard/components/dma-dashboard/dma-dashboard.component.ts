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
  creativeTypeId: any = 0; // Default creative type ID
  roleId: number = 0; // Default Role ID
  name:any;
  empname:any; 
  fromDate = new FormControl(moment().format('YYYY-MM-DD')); // Default: Today’s Date
  toDate = new FormControl(moment().format('YYYY-MM-DD'));   // Default: Today’s Date
  userId: number = 0;
  showSpinner: boolean = false;
  filteredDeliverables = new MatTableDataSource<any>([]);
  clientData = new MatTableDataSource<any>([]);
  metrics: any = {}; // ✅ Fix for metrics property
  clientNameFilter = new FormControl(''); // **Filter for Client Name**
  activeFilters: { [key: string]: boolean } = {}; // **Track Active Filters**

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
    'totalposters',
    'posterspending',
    'postersPromoted',
    'totalgReels',
    'gReelspending',
    'gReelsPromoted',
    'totaledReels',
    'edReelspending',
    'edReelsPromoted',
    'totalYTVideos',
    'youtubeVideospending',
    'youtubeVideosPromoted',
  ];


  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = +params['userId'] || parseInt(localStorage.getItem('UserID') || '0', 10);
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.roleId = +params['roleid'] || 0;
      this.name = params['name'];
      this.empname = params['empname'] || localStorage.getItem('firstName')

      // ✅ Fix: Ensure correct date parsing
      this.fromDate.setValue(moment(params['fromDateValue'], 'YYYY-MM-DD').isValid() ? params['fromDateValue'] : moment().format('YYYY-MM-DD'));
      this.toDate.setValue(moment(params['toDateValue'], 'YYYY-MM-DD').isValid() ? params['toDateValue'] : moment().format('YYYY-MM-DD'));

      if (this.userId > 0) {
        this.fetchDashboardData();
      } else {
        console.error('Invalid userId: Unable to fetch dashboard data');
      }
    });

    // ✅ Ensure the function is called when dates are changed
    this.fromDate.valueChanges.subscribe(() => this.setFromAndToDate());
    this.toDate.valueChanges.subscribe(() => this.setFromAndToDate());

     // ✅ Apply client name filter dynamically
     this.clientNameFilter.valueChanges.subscribe(() => this.applyFilter());
  }
  setFromAndToDate(): void {
    this.fetchDashboardData(); // Fetch data based on updated dates
  }

  fetchDashboardData(): void {
    this.showSpinner = true;

    // Format the selected dates
    const formattedFromDate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const formattedToDate = moment(this.toDate.value).format('YYYY-MM-DD');

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
        
        this.applyFilter();
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error fetching DMA Dashboard data:', error);
      },
    });
  }
   // **Filter Function**
   applyFilter(): void {
    const clientName = this.clientNameFilter.value?.toLowerCase() || '';

    this.clientData.filterPredicate = (data: any) =>
      (!clientName || data.clientName.toLowerCase().includes(clientName));

    this.clientData.filter = Math.random().toString(); // Trigger filter refresh
  }

  // **Toggle filter visibility**
  toggleFilter(column: string): void {
    this.activeFilters[column] = !this.activeFilters[column];
  }

  editRow(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-pending-posts'], {
      queryParams: {
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
      },
    });
  }

  editRownew(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
      },
    });
  }

  early(lead: any): void {
    const userId = +localStorage.getItem('UserID')!;
    this.router.navigate(['/home/dashboard/dma-promoted-posts'], {
      queryParams: {
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
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
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
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
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
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
        fromDateValue: moment(this.fromDate.value).format('YYYY-MM-DD'),
        toDateValue: moment(this.toDate.value).format('YYYY-MM-DD'),
        userId: userId,
        creativeTypeId: lead.creativeTypeId,
        postStatus: 5,
      },
    });
  }
  goBack(): void {
    //this.router.navigate(['/home/dashboard/resource-list']); 
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
         roleid:9,
         creativeTypeId:this.creativeTypeId,
         name:this.name,
        }
      });
  }

}
