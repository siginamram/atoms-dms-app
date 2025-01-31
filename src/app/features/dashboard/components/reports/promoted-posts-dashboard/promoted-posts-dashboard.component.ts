import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute,Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-promoted-posts-dashboard',
  standalone:false,
  templateUrl: './promoted-posts-dashboard.component.html',
  styleUrl: './promoted-posts-dashboard.component.css'
})
export class PromotedPostsDashboardComponent implements OnInit {
  fromDateValue: any = ''; // Default from date
  toDateValue: any = ''; // Default to date
  userId: number = 4; // Default user ID
  creativeTypeId: number = 0; // Default creative type ID
  statistics = new MatTableDataSource<any>([]); // Table data with pagination
  clientName: any;
  postStatus:any;
  showSpinner: boolean = false; // Default value
  activeFilters: { [key: string]: boolean } = {}; // Track active filters for each column
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
      this.fromDateValue = params['fromDateValue'] || this.formatDate(new Date());
      this.toDateValue = params['toDateValue'] || this.formatDate(new Date());
      this.userId = +params['userId'] || 1;
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.clientName = params['type'];
      this.postStatus=+params['postStatus'] || 0;
      this.fetchPendingPosts();
    });

    // Custom filterPredicate for filtering based on 'organizationName'
 this.statistics.filterPredicate = (data, filter) =>
  data.organizationName.toLowerCase().includes(filter);
    this.statistics.paginator = this.paginator;
  }
  ngAfterViewInit(): void {
    this.statistics.paginator = this.paginator;
  }

  toggleFilterVisibility(column: string): void {
    this.activeFilters[column] = !this.activeFilters[column];
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.statistics.filterPredicate = (data, filter) => {
      switch (column) {
        case 'organizationName':
          return data.organizationName?.toLowerCase().includes(filter);
        case 'contentWriter':
          return data.contentWriter?.toLowerCase().includes(filter);
        case 'editor':
          return data.editor?.toLowerCase().includes(filter);
        case 'contentStatus':
          return this.getStatus(data.contentStatus)?.toLowerCase().includes(filter);
        case 'graphicStatus':
          return this.getStatus(data.graphicStatus)?.toLowerCase().includes(filter);
        default:
          return false;
      }
    };

    this.statistics.filter = filterValue;
  }

  fetchPendingPosts(): void {
    this.showSpinner = true;
  
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);
  
    this.dashboardService.promotedPostsDashboard(this.userId, fdate, tdate, this.creativeTypeId).subscribe(
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

  getpostStatus(status: number): string {
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

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
