import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service'; 

@Component({
  selector: 'app-statistics',
  standalone:false,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  fromDateValue: any= [];
  toDateValue: any= [];
  userId: any;
  statistics: any[] = [];
  showSpinner: boolean = false; // Default value
  clientName: any;
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0]; // Default to today's date

    // Get query params from the route
    this.route.queryParams.subscribe((params) => {
      this.fromDateValue = params['fromDateValue'] || today;
      this.toDateValue = params['toDateValue'] || today;
      this.userId = +params['userId'] || +localStorage.getItem('UserID')! || 1;
      this.clientName = params['type'];
      // Fetch statistics based on parameters
      this.fetchStatistics();
    });
  }
  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  fetchStatistics(): void {
    this.showSpinner = true;
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);
    this.dashboardService
      .GetStatisticsByUser(this.userId, fdate, tdate)
      .subscribe(
        (data: any) => {
          this.showSpinner = false;
          this.statistics = [
            { label: 'Total Clients', value: data.totalClients, color: '#795548', icon: 'account_box' },
            { label: 'Newly Added Clients', value: data.totalNewClients, color: '#795548', icon: 'account_box' },
            { label: 'Content Written', value: data.totalContent, color: '#4caf50', icon: 'description' },
            { label: 'Posters Designed', value: data.totalPoster, color: '#ff9800', icon: 'image' },
            { label: 'Videos Designed', value: data.totalVideosEdited, color: '#2196f3', icon: 'video_library' },
            { label: 'Shoots Conducted', value: data.totalShootConducted, color: '#8bc34a', icon: 'photo_camera' },
            { label: 'Videos Shot', value: data.totalVideosRecorded, color: '#607d8b', icon: 'videocam' },
            { label: 'Ad Campaigns', value: data.totalCampaigns, color: '#f44336', icon: 'campaign' },
            { label: 'Leads Generated', value: data.totalLeadGenerated, color: '#ffc107', icon: 'emoji_people' },
            { label: 'Profile Visits', value: data.totalProfileVisits, color: '#9c27b0', icon: 'person' },
            { label: 'Followers Increased', value: data.followersIncreased, color: '#ff5722', icon: 'group_add' },
            { label: 'Reach', value: data.totalReach, color: '#673ab7', icon: 'public' },
            { label: 'Impressions', value: data.totalImpressions, color: '#3f51b5', icon: 'visibility' }
          ];
        },
        (error) => {
          this.showSpinner = false;
          console.error('Error fetching statistics:', error);
        }
      );
  }

  applyFilters(): void {
  // Fetch statistics based on parameters
  this.fetchStatistics();
  }

  goBack(): void {
    if (this.clientName === 'manager') {
     // this.router.navigate(['/home/dashboard/manager-dashboard']);
     const formattedFromDate = this.formatDate(this.fromDateValue);
     const formattedToDate = this.formatDate(this.toDateValue); 
     this.router.navigate(['/home/dashboard/manager-dashboard'],{
       queryParams: {
         fromDateValue:formattedFromDate,
          toDateValue:formattedToDate,
         },
     });
    } else {
      //this.router.navigate(['/home/dashboard/lead-dashboard']);
      const formattedFromDate = this.formatDate(this.fromDateValue);
      const formattedToDate = this.formatDate(this.toDateValue); 
      this.router.navigate(['/home/dashboard/lead-dashboard'],{
        queryParams: {
          fromDateValue:formattedFromDate,
           toDateValue:formattedToDate,
          },
      });
    }
  }
}
