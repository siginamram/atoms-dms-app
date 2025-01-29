import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-kt-session-dashboard',
  standalone: false,
  templateUrl: './kt-session-dashboard.component.html',
  styleUrls: ['./kt-session-dashboard.component.css'],
})
export class KtSessionDashboardComponent implements OnInit, AfterViewInit {
  userId: any = 0; // User ID
  statistics = new MatTableDataSource<any>([]); // Table Data with Pagination
  displayedColumns: string[] = ['sno', 'organizationName', 'dealCloseDate', 'ktDate', 'ktStatus'];
  isLoading = true; // Spinner Loader
  clientName: any;
  name: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute,  private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      this.userId = +params['userId'] || 0;
      this.clientName = params['type'];
      this.name = params['name'];

      this.fetchKTSessionData();
    });
  }

  ngAfterViewInit(): void {
    this.statistics.paginator = this.paginator;
  }

  fetchKTSessionData(): void {
    if (!this.userId) {
      console.error('Missing userId');
      return;
    }

    this.isLoading = true;
    this.dashboardService.KTStatusDashboard(this.userId).subscribe(
      (data: any) => {
        this.statistics.data = data || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching KT session data:', error);
        this.isLoading = false;
      }
    );
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
