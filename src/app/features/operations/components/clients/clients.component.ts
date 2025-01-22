import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  @ViewChild('onboardingPaginator') onboardingPaginator!: MatPaginator;
  @ViewChild('presentPaginator') presentPaginator!: MatPaginator;
  @ViewChild('exitPaginator') exitPaginator!: MatPaginator;

  activeTab = 'onboarding'; // Default tab
  onboardingColumns = ['id', 'clientName', 'dealClosingDate', 'domain', 'category', 'ktStatus', 'city', 'edit'];
  presentColumns = ['id', 'clientName', 'domain', 'category', 'package', 'ktDocument', 'city', 'edit'];
  exitColumns = ['id', 'clientName', 'domain', 'category', 'package', 'ktDocument', 'city'];
  showSpinner: boolean = false;

  onboardingData = new MatTableDataSource<any>();
  presentData = new MatTableDataSource<any>();
  exitData = new MatTableDataSource<any>();

  constructor(private router: Router, private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.bindPaginators();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.bindPaginators();
  }

  bindPaginators(): void {
    setTimeout(() => {
      if (this.activeTab === 'onboarding') {
        this.onboardingData.paginator = this.onboardingPaginator;
      } else if (this.activeTab === 'present') {
        this.presentData.paginator = this.presentPaginator;
      } else if (this.activeTab === 'exit') {
        this.exitData.paginator = this.exitPaginator;
      }
    });
  }

  fetchData(): void {
    const userId = +localStorage.getItem('UserID')!;
    this.showSpinner = true;

    this.operationsService.getOnboardByStatus(userId, 1).subscribe({
      next: (response) => {
        this.onboardingData.data = response.map((item: any) => ({
          clientName: item.organizationName || 'Unknown',
          dealClosingDate: item.dealCloseDate || 'N/A',
          domain: item.domain || 'N/A',
          category: this.mapCategory(item.clientCategory),
          ktStatus: item.isKTCompleted ? 'Completed' : 'Pending',
          city: item.cityName || 'N/A',
          clientId: item.clientId,
        }));
        this.showSpinner = false;
      },
      error: () => (this.showSpinner = false),
    });

    this.operationsService.getOnboardByStatus(userId, 2).subscribe({
      next: (response) => {
        this.presentData.data = response.map((item: any) => ({
          clientName: item.organizationName || 'Unknown',
          domain: item.domain || 'N/A',
          category: this.mapCategory(item.clientCategory),
          package: item.basePackage || 'N/A',
          ktDocument: item.ktDocUrl ? 'Uploaded' : 'Pending',
          city: item.cityName || 'N/A',
          clientId: item.clientId,
        }));
      },
    });

    this.operationsService.getOnboardByStatus(userId, 3).subscribe({
      next: (response) => {
        this.exitData.data = response.map((item: any) => ({
          clientName: item.organizationName || 'Unknown',
          domain: item.domain || 'N/A',
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

  editClient(client: any): void {
    this.router.navigate([`/home/operations/clients-onboards/${client}`]);
    console.log('Edit Client:', client);
  }

  editPresentClient(client: any): void {
    this.router.navigate([`/home/operations/clients-present/${client}`]);
    console.log('Edit Present Client:', client);
  }
}
