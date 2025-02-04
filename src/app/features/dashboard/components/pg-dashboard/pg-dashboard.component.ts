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
  selector: 'app-pg-dashboard',
  standalone: false,
  templateUrl: './pg-dashboard.component.html',
  styleUrl: './pg-dashboard.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class PgDashboardComponent implements OnInit {
  date = new FormControl(moment()); // Default to current month and year
  userId: number = 0;
  showSpinner: boolean = false; // Default value
  filteredData = new MatTableDataSource<any>([]);
  
  // Metrics from API
  // API metrics variables
  totalClients = 0;
  totalShootsRequired = 0;
  totalShootsCompleted = 0;
  totalYTRequired = 0;
  totalYTShooted = 0;
  totalEDRequired = 0;
  totalEDShooted = 0;
  // Initialize totals
totalYtRequired: number = 0;
totalYtShooted: number = 0;
totalEdRequired: number = 0;
totalEdShooted: number = 0;

  // Table data columns
  displayedColumns: string[] = [
    'sno',
    'organizationName',
    'dates',
    'noOfYtRequired',
    'noOfYTShooted',
    'noOfEDRequired',
    'noOfEDShooted',
  ];

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
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

  fetchDashboardData(): void {
    this.showSpinner = true;
    const selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Default day is 01
    this.dashboardService.GetVideoGrapherDashboardByMonth(this.userId, selectedDate).subscribe(
      (response: any) => {
        this.showSpinner = false;
        // Assign API metrics
        this.totalClients = response.videoGrapherSummary.totalClients;
        this.totalShootsRequired = response.videoGrapherSummary.noOfShootsRequired;
        this.totalShootsCompleted = response.videoGrapherSummary.noOfShootsCompleted;
        this.totalYTRequired = response.videoGrapherSummary.noOfYTRequired;
        this.totalYTShooted = response.videoGrapherSummary.noOfYTShooted;
        this.totalEDRequired = response.videoGrapherSummary.noOfEDRequired;
        this.totalEDShooted = response.videoGrapherSummary.noOfEDShooted;

     
 // Assuming `response` is already fetched from the API
 this.filteredData.data = response.videoGrapherShootSummary.map((item: any) => {
  // Update totals
  this.totalYtRequired += item.noOfYtRequired || 0;
  this.totalYtShooted += item.noOfYTShooted || 0;
  this.totalEdRequired += item.noOfEDRequired || 0;
  this.totalEdShooted += item.noOfEDShooted || 0;

  return {
    organizationName: item.organizationName,
    dates: item.dates ? moment(item.dates).format('YYYY-MM-DD hh:mm A') : 'N/A',
    noOfYtRequired: item.noOfYtRequired,
    noOfYTShooted: item.noOfYTShooted,
    noOfEDRequired: item.noOfEDRequired,
    noOfEDShooted: item.noOfEDShooted,
  };
});
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching Photographer Dashboard data:', error);
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
