import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leadmanagementlist',
  templateUrl: './leadmanagementlist.component.html',
  styleUrls: ['./leadmanagementlist.component.css'],
})
export class LeadmanagementlistComponent implements OnInit {
  // Tabs
  activeTab: string = 'progressive';

  // Columns
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'salesperson',
    'reporedDate',
    'status',
    'actions',
  ];

  // Sample Data
  leads = [
    {
      id: 1,
      organizationName: 'Tech Solutions',
      salespersonName: 'John Doe',
      reporedDate: '10-12-2024',
      status: 'progressive',
    },
    {
      id: 2,
      organizationName: 'Green Energy',
      salespersonName: 'Emma Green',
      reporedDate: '11-12-2024',
      status: 'rejected',
    },
    {
      id: 3,
      organizationName: 'Future FinTech',
      salespersonName: 'Michael Brown',
      reporedDate: '12-12-2024',
      status: 'converted',
    },
  ];

  filteredLeads = [...this.leads]; // Copy for filtering

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilter(); // Apply default filter for Progressive
  }

  // Tab Switching
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  // Apply Filter based on Tab
  applyFilter(): void {
    this.filteredLeads = this.leads.filter((lead) => lead.status === this.activeTab);
  }

  // Navigate to Add Lead Page
  Register(): void {
    this.router.navigate(['/home/leadmanagement/add']);
  }

  // View Lead Details
  viewLead(id: number): void {
    console.log('View lead:', id);
    // Navigate to detail page or open modal
  }
}
