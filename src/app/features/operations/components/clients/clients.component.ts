import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent {
    constructor( private router: Router) {}
  activeTab = 'onboarding'; // Default tab
  onboardingColumns = ['clientName', 'dealClosingDate', 'domain', 'category', 'ktStatus', 'city', 'edit'];
  presentColumns = ['clientName', 'domain', 'category', 'package', 'ktDocument', 'city', 'edit'];

  onboardingData = [
    { clientName: 'Client A', dealClosingDate: '2024-12-20', domain: 'IT', category: 'A', ktStatus: 'Completed', city: 'New York' },
    { clientName: 'Client B', dealClosingDate: '2024-12-19', domain: 'Health', category: 'B', ktStatus: 'Pending', city: 'Los Angeles' },
  ];

  presentData = [
    { clientName: 'Client X', domain: 'Finance', category: 'Gold', package: 'Premium', ktDocument: 'Uploaded', city: 'Chicago' },
    { clientName: 'Client Y', domain: 'Retail', category: 'Silver', package: 'Standard', ktDocument: 'Pending', city: 'Houston' },
  ];

  switchTab(tab: string) {
    console.log('Switching to tab:', tab);
    this.activeTab = tab;
  }

  editClient(client: any) {
    this.router.navigate([`/home/operations/clients-onboards/${client}`]);
    console.log('Edit Client:', client);
    // Implement edit logic here
  }
  editPresentClient(client: any) {
    this.router.navigate([`/home/operations/clients-present/${client}`]);
    console.log('Edit Client:', client);
    // Implement edit logic here
  }
}
