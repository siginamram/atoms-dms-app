import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-lead-management-list',
  templateUrl: './lead-management-list.component.html',
  styleUrls: ['./lead-management-list.component.css'],
})
export class LeadManagementListComponent implements OnInit {
  // Tabs
  activeTab: string = 'progressive';

  // Columns
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'salesperson',
    'reporedDate',
    'cityName',
    'pocName',
    'pocContact',
    'insight',
  ];

  // Leads Data
  filteredLeads: any[] = [];

  constructor(private router: Router, private commanApiService: MarketingService) {}

  ngOnInit(): void {
    this.loadLeads(); // Load leads based on the default tab
  }
  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Progressive';
        case 2:
        return 'Converted';
      case 3:
        return 'Rejected';
      default:
        return 'Unknown'; // Fallback for unexpected status values
    }
  }
  
  // Tab Switching
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.loadLeads();
  }

  // Load Leads based on the active tab
  loadLeads(): void {
    //debugger;
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10); // Fetch UserID from localStorage
    const status = this.activeTab === 'progressive' ? 1 : 3; // Map tab to status

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any) => {
        console.log('Fetched Leads:', data);
        this.filteredLeads = data; // Bind fetched data to the table
      },
      (error) => {
        console.error('Failed to fetch leads:', error);
      }
    );
  }

  // Navigate to Add Lead Page
  Register(): void {
    this.router.navigate(['/home/marketing/add-lead']);
  }

  // View Lead Details (Navigate to Edit Page)
viewLead(id: number): void {
  console.log('Edit Lead:', id);
  // Navigate to the edit page with the lead ID
  this.router.navigate(['/home/marketing/sales-convert-status-edit', id]);
}

}
