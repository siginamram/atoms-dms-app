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
  displayedColumns: string[] = [
    'index',
    'organizationName',
    'postScheduleOn',
    'contentWriter',
    'editor',
    'contentStatus',
    'graphicStatus',
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
      this.postStatus=params['postStatus'] || 0;
      this.fetchPendingPosts();
    });

    this.statistics.paginator = this.paginator;
  }
  ngAfterViewInit(): void {
    this.statistics.paginator = this.paginator;
  }

  fetchPendingPosts(): void {
    this.showSpinner = true;
  
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);
  
    this.dashboardService.promotedPostsDashboard(this.userId, fdate, tdate, this.creativeTypeId).subscribe(
      (data: any[]) => {
        console.log('API Response:', data); // Debug API Response
        console.log('postStatus:', this.postStatus); // Debug postStatus
  
        // Apply Filtering
        const filteredData = this.postStatus === 0
          ? data
          : data.filter((item: { postStatus: number }) => {
              console.log('Item Post Status:', item.postStatus); // Debug each item's postStatus
              return Number(item.postStatus) === Number(this.postStatus);
            });
  
        console.log('Filtered Data:', filteredData); // Debug Filtered Data
  
        this.showSpinner = false;
        this.statistics.data = filteredData; // Assign Filtered Data to Table
        this.statistics._updateChangeSubscription(); // Update Table
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
    if(this.clientName=='manager'){
    this.router.navigate(['/home/dashboard/manager-dashboard']); 
    }
    else{
      this.router.navigate(['/home/dashboard/lead-dashboard']); 
    }
  }
}
