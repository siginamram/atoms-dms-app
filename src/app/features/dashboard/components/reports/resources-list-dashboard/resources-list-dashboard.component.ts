import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-resources-list-dashboard',
  standalone: false,
  templateUrl: './resources-list-dashboard.component.html',
  styleUrls: ['./resources-list-dashboard.component.css'],
})
export class ResourcesListDashboardComponent implements OnInit, AfterViewInit {
  creativeTypeId: any = 0; // Default creative type ID
  roleId: number = 0; // Default Role ID
  statistics = new MatTableDataSource<any>([]); // Table Data with Pagination
  displayedColumns: string[] = ['sno', 'empName', 'noOfClients']; // Table Columns
  isLoading = true; // Spinner Loader
  name:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  clientName: any;

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute,  private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.creativeTypeId = +params['creativeTypeId'] || 0;
      this.roleId = +params['roleid'] || 0;
      this.clientName = params['type'];
      this.name = params['name'];
      this.fetchResourcesData();
    });
    this.statistics.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.statistics.paginator = this.paginator;
  }

  fetchResourcesData(): void {
    if (!this.roleId || !this.creativeTypeId) {
      console.error('Missing roleId or creativeTypeId');
      return;
    }

    this.isLoading = true;
    this.dashboardService.resourcesDataDashboard(this.roleId, this.creativeTypeId).subscribe(
      (data: any) => {
        this.statistics.data = data || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching resources data:', error);
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

  editRow(lead: any): void {
    console.log(lead);
  if(this.name=='Content Writer')
  {
    this.router.navigate(['/home/dashboard/cw-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }
  else if(this.name=='Poster Designer'){
    this.router.navigate(['/home/dashboard/pd-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }
  else if(this.name=='Video Editor'){
    this.router.navigate(['/home/dashboard/video-editor-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }
  else if(this.name=='DMA'){
    this.router.navigate(['/home/dashboard/dma-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }
  else if(this.name=='Videographer'){
    this.router.navigate(['/home/dashboard/pg-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }
  else if(this.name=='Team Lead'){
    this.router.navigate(['/home/dashboard/lead-dashboard'],{
      queryParams: {
         userId:lead.userId,
        },
    });
  }

  } 
 
}
