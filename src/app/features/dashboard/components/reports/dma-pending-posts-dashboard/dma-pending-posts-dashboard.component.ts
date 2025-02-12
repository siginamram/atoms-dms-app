import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-dma-pending-posts-dashboard',
  standalone:false,
  templateUrl: './dma-pending-posts-dashboard.component.html',
  styleUrls: ['./dma-pending-posts-dashboard.component.css'],
})
export class DmaPendingPostsDashboardComponent implements OnInit {
  fromDate = new FormControl(moment()); // Default to the current month
  toDate = new FormControl(moment()); // Default to the current month
  userId: number = 4;
  creativeTypeId: number = 0;
  statistics = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  activeFilters: { [key: string]: string } = {};
  filterVisibility: { [key: string]: boolean } = {}; // Tracks open filters
  displayedColumns: string[] = [
    'index',
    'organizationName',
    'postScheduleOn',
    'contentStatus',
    'contentWriter',
    'graphicStatus',
    'editor',
    'postStatus',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const fromDateParam = params['fromDateValue']; // Get date from URL
      const toDateParam = params['toDateValue']; // Get date from URL
      this.userId = +params['userId'] || 4;
      this.creativeTypeId = +params['creativeTypeId'] || 0;

      // Bind calendar to the Month and Year from `fromDateValue`
      if (fromDateParam) {
        this.fromDate.setValue(moment(fromDateParam, 'YYYY-MM-DD')); // Set the form control correctly
        this.toDate.setValue(moment(toDateParam, 'YYYY-MM-DD'));
      }

      this.fetchPendingPosts();
    });

    this.statistics.paginator = this.paginator;
    this.statistics.filterPredicate = (data, filter) => {
      const filters = JSON.parse(filter); // Parse stored filters
  
      return Object.keys(filters).every((key) => {
        const filterVal = filters[key];
        if (!filterVal) return true; // Ignore empty filters
  
        switch (key) {
          case 'organizationName':
            return data.organizationName?.toLowerCase().includes(filterVal);
          case 'contentWriter':
            return data.contentWriter?.toLowerCase().includes(filterVal);
          case 'editor':
            return data.editor?.toLowerCase().includes(filterVal);
          case 'contentStatus':
            return this.getStatus(data.contentStatus)?.toLowerCase().includes(filterVal);
          case 'graphicStatus':
            return this.getStatus(data.graphicStatus)?.toLowerCase().includes(filterVal);
          default:
            return true;
        }
      });
    };
  }
  

  fetchPendingPosts(): void {
    this.showSpinner = true;
    const formattedDate = this.fromDate.value?.format('YYYY-MM') + '-01'; // Format to YYYY-MM-01
    const toattedDate = this.toDate.value?.format('YYYY-MM') + '-01'; // Format to YYYY-MM-01
    this.dashboardService
      .DMAPendingPostsDashboard(this.userId, formattedDate,toattedDate, this.creativeTypeId)
      .subscribe(
        (data: any) => {
          this.showSpinner = false;
          this.statistics.data = data || [];
        },
        (error) => {
          this.showSpinner = false;
          console.error('Error fetching pending posts data:', error);
        }
      );
  }

  toggleFilterVisibility(column: string): void {
    this.filterVisibility[column] = !this.filterVisibility[column]; // Toggle visibility
  }
  

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeFilters[column] = filterValue || ''; // Store the filter
    this.statistics.filter = JSON.stringify(this.activeFilters); // Ensure Angular detects changes
  }
  
  
  

  getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Yet to start';
      case 2:
        return 'Saved in draft';
      case 3:
        return 'Sent for approval';
      case 4:
        return 'Changes recommended';
      case 5:
        return 'Approved';
      case 6:
        return 'Sent for client approval';
      default:
        return 'N/A';
    }
  }

  getPostStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Yet to Post';
      case 2:
        return 'Early Post';
      case 3:
        return 'On Time Post';
      case 4:
        return 'Late Posted';
      default:
        return 'N/A';
    }
  }

  resetFilters(): void {
    this.activeFilters = {};
    this.statistics.filter = ''; // Clear all filters
  }

  goBack(): void {
    this.router.navigate(['/home/dashboard/dma-dashboard']);
  }
}
