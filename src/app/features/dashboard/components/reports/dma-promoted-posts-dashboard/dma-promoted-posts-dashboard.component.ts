import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-dma-promoted-posts-dashboard',
  standalone:false,
  templateUrl: './dma-promoted-posts-dashboard.component.html',
  styleUrl: './dma-promoted-posts-dashboard.component.css'
})
export class DmaPromotedPostsDashboardComponent implements OnInit {
  fromDate: any; // Default to the current month
  toDate :any; // Default to the current month
  userId: number = 4;
  postStatus:any;
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
    'link',
    'postStatus',
    'postRemarks'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fullTextDialog') fullTextDialog: any;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
       private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fromDate = params['fromDateValue']; // Get date from URL
      this.toDate = params['toDateValue']; // Get date from URL
      this.userId = +params['userId'] || 4;
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.postStatus=+params['postStatus'] || 0;
      // Bind calendar to the Month and Year from `fromDateValue`
      // if (fromDateParam) {
      //     this.fromDate.setValue(moment(fromDateParam, 'YYYY-MM-DD')); // Set the form control correctly
      //     this.toDate.setValue(moment(toDateParam, 'YYYY-MM-DD'));
      // }

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
  ngAfterViewInit(): void {
    this.statistics.paginator = this.paginator;
  }
  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  fetchPendingPosts(): void {
    this.showSpinner = true;
    const formattedDate =  this.formatDate(this.fromDate); 
    const toattedDate = this.formatDate(this.toDate); 
    this.dashboardService
      .DMAPromotedPostsDashboard(this.userId, formattedDate,toattedDate, this.creativeTypeId)
      .subscribe(
        (data: any[]) => {
          //console.log('API Response:', data); // Debug API Response
          //console.log('postStatus:', this.postStatus); // Debug postStatus
    
          let filteredData: any[] = [];
    
          // Validate that the API response is an array
          if (Array.isArray(data) && data.length > 0) {
            if (this.postStatus === 0) {
              //console.log('RK Response:', data);
              // If postStatus is 0, assign the entire data
              filteredData = data;
            } else {
              // Filter data for other postStatus values
              filteredData = data.filter((item: { postStatus: number }) => {
               // console.log('Filtering Item:', item); // Debug individual items
                return Number(item.postStatus) === Number(this.postStatus);
              });
            }
          } else {
            console.warn('No valid data received from the API');
          }
    
         // console.log('Filtered Data:', filteredData); // Debug filtered data
    
          // Update table data and ensure the table refreshes
          this.statistics.data = filteredData || [];
          this.statistics._updateChangeSubscription(); // Update table
          this.showSpinner = false;
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
      case 7:
        return 'Lead approval Completed';
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
      case 5:
          return 'Client Rejected';
      case 6:
        return 'Failed'
      default:
        return 'N/A';
    }
  }

  resetFilters(): void {
    this.activeFilters = {};
    this.statistics.filter = ''; // Clear all filters
  }

  goBack(): void {
    //this.router.navigate(['/home/dashboard/dma-dashboard']);
    const formattedFromDate = this.formatDate(this.fromDate);
    const formattedToDate = this.formatDate(this.toDate); 
    this.router.navigate(['/home/dashboard/dma-dashboard'],{
      queryParams: {
        fromDateValue:formattedFromDate,
         toDateValue:formattedToDate,
         userId:this.userId,
         name:'DMA',
         roleid:9, 
         creativeTypeId:1, 
        },
    });
  }

      showFullText(text: string, title: string): void {
    this.dialog.open(this.fullTextDialog, {
      width: '400px',
      data: {
        text: text,
        title: title,
      },
    });
  }
  
}
