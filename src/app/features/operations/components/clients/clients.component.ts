import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-clients',
  standalone:false,
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  activeTab = 'onboarding'; // Default tab
  onboardingColumns = ['id','clientName', 'dealClosingDate', 'domain', 'category', 'ktStatus', 'city', 'edit'];
  presentColumns = ['id','clientName', 'domain', 'category', 'package', 'ktDocument', 'city', 'edit'];
  exitColumns = ['id','clientName', 'domain', 'category', 'package', 'ktDocument', 'city'];
  showSpinner: boolean = false;
  onboardingData: any[] = [];
  presentData: any[] = [];
  exitData: any[] = [];

  constructor(private router: Router, private operationsService: OperationsService) {}

  ngOnInit(): void {
    const userId = +localStorage.getItem('UserID')!; // Retrieve user ID from local storage
    this.fetchOnboardingData(userId);
    this.fetchPresentData(userId);
    this.fetchExitData(userId);
  }

  switchTab(tab: string): void {
    console.log('Switching to tab:', tab);
    this.activeTab = tab;
  }

  fetchOnboardingData(userId: number): void {
    this.showSpinner = true;
    this.operationsService.getOnboardByStatus(userId, 1).subscribe(
      (response) => {
        this.onboardingData = response.map((item: any) => ({
          clientName: item.organizationName,
          dealClosingDate: item.dealCloseDate,
          domain: item.domain,
          category: this.mapCategory(item.clientCategory),
          ktStatus: item.isKTCompleted ? 'Completed' : 'Pending',
          city: item.cityName,
          clientId:item.clientId,
        }));
        console.log('Onboarding Data:', this.onboardingData);
        this.showSpinner = false;
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching onboarding data:', error);
      }
    );
  }

  fetchPresentData(userId: number): void {
    this.showSpinner = true;
    this.operationsService.getOnboardByStatus(userId, 2).subscribe(
      (response) => {
        this.presentData = response.map((item: any) => ({
          clientName: item.organizationName,
          domain: item.domain,
          category: this.mapCategory(item.clientCategory),
          package: item.basePackage,
          ktDocument: item.ktDocUrl ? 'Uploaded' : 'Pending',
          city: item.cityName,
          clientId:item.clientId,
        }));
        console.log('Present Data:', this.presentData);
        this.showSpinner = false;
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching present data:', error);
      }
    );
  }

  fetchExitData(userId: number): void {
    this.showSpinner = true;
    this.operationsService.getOnboardByStatus(userId, 3).subscribe(
      (response) => {
        this.exitData = response.map((item: any) => ({
          clientName: item.organizationName,
          domain: item.domain,
          category: this.mapCategory(item.clientCategory),
          package: item.basePackage,
          ktDocument: item.ktDocUrl ? 'Uploaded' : 'Pending',
          city: item.cityName,
          clientId:item.clientId,
        }));
        this.showSpinner = false;
        console.log('Exit Data:', this.exitData);
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching exit data:', error);
      }
    );
  }

  mapCategory(categoryId: number): string {
    const categories: Record<number, string> = {
      1: 'A',
      2: 'B',
      3: 'C',
    };
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

  // editExitClient(client: any): void {
  //   this.router.navigate([`/home/operations/clients-exit/${client.clientName}`]);
  //   console.log('Edit Exit Client:', client);
  // }
}
