import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-pg-dashboard',
  standalone: false,
  templateUrl: './pg-dashboard.component.html',
  styleUrl: './pg-dashboard.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class PgDashboardComponent implements OnInit {
  creativeTypeId: any = 0; // Default creative type ID
  roleId: number = 0; // Default Role ID
  name:any;
  empname:any; 
  date = new FormControl(moment()); // Default to current month and year
  userId: number = 0;
  showSpinner: boolean = false;
  filteredData = new MatTableDataSource<any>([]);
  activeFilters: { [key: string]: boolean } = {};
  // Metrics
  totalAssignedClients = 0;
  noOfShootOfferedClients = 0;
  noOfShootsPending = 0;
  noOfShootsCompleted = 0;
  noOfYTOffered = 0;
  noOfYTShooted = 0;
  noOfEDOffered = 0;
  noOfEDShooted = 0;
  noOfYTExcessVideos = 0;
  noOfEDExcessVideos=0;

    // Totals for footer
    totalYouTubeOffered = 0;
    totalYouTubeRequired = 0;
    totalYouTubeShooted = 0;
    totalEDOffered = 0;
    totalEDRequired = 0;
    totalEDShooted = 0;

  // Columns for table
  displayedColumns: string[] = [
    'sno',
    'organizationName',
    'dates',
    'noOfYTVideosOffered',
    'noOfYtRequired',
    'noOfYTShooted',
    'noOfEDVideosOffered',
    'noOfEDRequired',
    'noOfEDShooted',
  ];

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {
    // Initialize filter visibility for each column
    this.displayedColumns.forEach((column) => (this.activeFilters[column] = false));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const queryUserId = +params['userId'];
      this.userId = !isNaN(queryUserId) && queryUserId > 0 ? queryUserId : parseInt(localStorage.getItem('UserID') || '0', 10);
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.roleId = +params['roleid'] || 0;
      this.name = params['name'];
      this.empname = params['empname'] || localStorage.getItem('firstName')
    });

    if (this.userId && this.userId > 0) {
      this.fetchDashboardData();
    } else {
      console.error('Invalid userId: Unable to fetch dashboard data');
    }
  }
  toggleFilterVisibility(column: string): void {
    this.activeFilters[column] = !this.activeFilters[column];
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.filteredData.filterPredicate = (data, filter) => {
      switch (column) {
        case 'organizationName':
          return data.organizationName?.toLowerCase().includes(filter);
        default:
          return false;
      }
    };

    this.filteredData.filter = filterValue;
  }


  fetchDashboardData(): void {
    this.showSpinner = true;
    const selectedDate = this.date.value?.format('YYYY-MM') + '-01';
    this.dashboardService.GetVideoGrapherDashboardByMonth(this.userId, selectedDate).subscribe(
      (response: any) => {
        this.showSpinner = false;

        // Assign metrics
        this.totalAssignedClients = response.videoGrapherSummary.totalAssignedClients;
        this.noOfShootOfferedClients = response.videoGrapherSummary.noOfShootOfferedClients;
        this.noOfShootsPending = response.videoGrapherSummary.noOfShootsPending;
        this.noOfShootsCompleted = response.videoGrapherSummary.noOfShootsCompleted;
        this.noOfYTOffered = response.videoGrapherSummary.noOfYTOffered;
        this.noOfYTShooted = response.videoGrapherSummary.noOfYTShooted;
        this.noOfEDOffered = response.videoGrapherSummary.noOfEDOffered;
        this.noOfEDShooted = response.videoGrapherSummary.noOfEDShooted;
        this.noOfYTExcessVideos = response.videoGrapherSummary.noOfYTExcessVideos;
        this.noOfEDExcessVideos = response.videoGrapherSummary.noOfEDExcessVideos;
        // Assigning totals
        this.totalYouTubeOffered = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfYTVideosOffered || 0),
          0
        );

        this.totalYouTubeRequired = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfYtRequired || 0),
          0
        );

        this.totalYouTubeShooted = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfYTShooted || 0),
          0
        );

        this.totalEDOffered = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfEDVideosOffered || 0),
          0
        );

        this.totalEDRequired = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfEDRequired || 0),
          0
        );

        this.totalEDShooted = response.videoGrapherShootSummary.reduce(
          (sum: number, item: any) => sum + (item.noOfEDShooted || 0),
          0
        );
        // Populate table
        this.filteredData.data = response.videoGrapherShootSummary.map((item: any) => ({
          organizationName: item.organizationName,
          dates: item.dates ? moment(item.dates).format('DD-MM-YYYY') : 'N/A',
          noOfYTVideosOffered: item.noOfYTVideosOffered,
          noOfYtRequired: item.noOfYtRequired,
          noOfYTShooted: item.noOfYTShooted,
          noOfEDVideosOffered: item.noOfEDVideosOffered,
          noOfEDRequired: item.noOfEDRequired,
          noOfEDShooted: item.noOfEDShooted,
        }));
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching dashboard data:', error);
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

  goBack(): void {
    //this.router.navigate(['/home/dashboard/resource-list']); 
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
         roleid:13,
         creativeTypeId:this.creativeTypeId,
         name:this.name,
        }
      });
  }
}
