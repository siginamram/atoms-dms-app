import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { LeadManagementEditComponent } from '../lead-management-edit/lead-management-edit.component';

@Component({
  selector: 'app-lead-management-list',
  templateUrl: './lead-management-list.component.html',
  styleUrls: ['./lead-management-list.component.css'],
})
export class LeadManagementListComponent implements OnInit {
  activeTab: string = 'progressive'; // Default tab is Progressive
  displayedColumns: string[] = [];
  filteredLeads: any[] = []; // Fetched leads based on the tab

  constructor(
    private router: Router,
    private commanApiService: MarketingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.switchTab(this.activeTab); // Load default tab data
  }

  // Get label for lead status
  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Progressive';
      case 2:
        return 'Converted';
      case 3:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  // Switch tabs and fetch data accordingly
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.updateDisplayedColumns(); // Update columns based on tab
    this.loadLeads(); // Fetch data for the selected tab
  }

  // Update displayed columns based on the active tab
  updateDisplayedColumns(): void {
    if (this.activeTab === 'progressive') {
      this.displayedColumns = [
        'id',
        'organizationName',
        'salesperson',
        'reporedDate',
        'cityName',
        'pocName',
        'pocContact',
        'insight',
      ];
    } else if (this.activeTab === 'rejected') {
      this.displayedColumns = [
        'id',
        'organizationName',
        'salesperson',
        'reporedDate',
        'cityName',
        'pocName',
        'pocContact',
        'insight',
        'actions',
      ];
    }
  }

  // Load leads based on the active tab
  loadLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = this.activeTab === 'progressive' ? 1 : 3; // Determine status based on the tab

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any) => {
        console.log(`Fetched Leads for ${this.activeTab} tab:`, data);
        this.filteredLeads = data; // Bind fetched data to the table
      },
      (error) => {
        console.error(`Failed to fetch ${this.activeTab} leads:`, error);
        this.filteredLeads = []; // Clear the table if there is an error
      }
    );
  }

  // Navigate to Add Lead page
  Register(): void {
    this.router.navigate(['/home/marketing/add-lead']);
  }

  // Navigate to Edit Lead page
  viewLead(id: number): void {
    this.router.navigate(['/home/marketing/sales-convert-status-edit', id]);
  }

  // Move Rejected lead to Progressive
  moveToProgressive(lead: any): void {
    if (confirm('Are you sure you want to move this lead to Progressive?')) {
      const dialogRef = this.dialog.open(LeadManagementEditComponent, {
        width: '400px',
        data: { lead }, // Pass the lead object to the dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'updated') {
          this.loadLeads(); // Reload leads after successful status update
        }
      });
    }
  }
}
