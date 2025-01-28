import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clients-list',
  standalone:false,
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent implements OnInit {
  isLoading = false; // Initially set to true
  clientName:string='';
  @ViewChild('onboardingPaginator') onboardingPaginator!: MatPaginator;
  onboardingColumns = ['id', 'clientName', 'dealClosingDate','domain', 'category', 'package', 'ktDocument', 'city',];
  onboardingData = new MatTableDataSource<any>();
  constructor(private router: Router, private DashboardService: DashboardService,  private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.clientName = params['type'];
    this.fetchData();
    });
  }

  ngAfterViewInit(): void {
    this.onboardingData.paginator = this.onboardingPaginator;
  }

  fetchData(): void {
    const userId = +localStorage.getItem('UserID')!;
    this.isLoading = true;

    this.DashboardService.getOnboardByStatus(userId, 2).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.onboardingData.data = response.map((item: any) => ({
          clientName: item.organizationName || 'Unknown',
          domain: item.domain || 'N/A',
          dealCloseDate:item.dealCloseDate,
          category: this.mapCategory(item.clientCategory),
          package: item.basePackage || 'N/A',
          ktDocument: item.ktDocUrl ? 'Uploaded' : 'Pending',
          city: item.cityName || 'N/A',
          clientId: item.clientId,
        }));
      },
    });


  }

  mapCategory(categoryId: number): string {
    const categories: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C' };
    return categories[categoryId] || 'Unknown';
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
