import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute,Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-pending-posts-dashboard',
  standalone:false,
  templateUrl: './pending-posts-dashboard.component.html',
  styleUrls: ['./pending-posts-dashboard.component.css'],
})
export class PendingPostsDashboardComponent implements OnInit {
  fromDateValue: any = ''; // Default from date
  toDateValue: any = ''; // Default to date
  userId: number = 4; // Default user ID
  creativeTypeId: number = 0; // Default creative type ID
  statistics = new MatTableDataSource<any>([]); // Table data with pagination
  clientName: any;
  showSpinner: boolean = false; // Default value
  activeFilters: { [key: string]: string } = {};
  filterVisibility: { [key: string]: boolean } = {}; // Tracks open filters
  displayedColumns: string[] = [
    'index',
    'organizationName',
    'postScheduleOn',
    'contentStatus',
    'contentWriter',
    'link',
    'graphicStatus',
    'editor',
    'dma',
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
            case 'dma':
              return data.dma?.toLowerCase().includes(filterVal);
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


  toggleFilterVisibility(column: string): void {
    this.filterVisibility[column] = !this.filterVisibility[column]; // Toggle visibility
  }
  

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeFilters[column] = filterValue || ''; // Store the filter
    this.statistics.filter = JSON.stringify(this.activeFilters); // Ensure Angular detects changes
  }

  fetchPendingPosts(): void {
    this.showSpinner = true;
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);
    this.dashboardService.pendingPostsDashboard(this.userId, fdate, tdate, this.creativeTypeId).subscribe(
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

  getStatusClass(status: number): string {
    const statusText = this.getStatus(status).toLowerCase().replace(/\s+/g, '-');
    return `status-${statusText}`;
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

