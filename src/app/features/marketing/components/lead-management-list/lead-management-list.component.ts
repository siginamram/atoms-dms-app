import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lead-management-list',
  templateUrl: './lead-management-list.component.html',
  styleUrls: ['./lead-management-list.component.css'],
})
export class LeadManagementListComponent implements OnInit {
  activeTab: string = 'progressive'; // Default tab is Progressive
  displayedColumns: string[] = [];
  filteredLeads: any[] = []; // Fetched leads based on the tab
   dataSource = new MatTableDataSource<any>(); // Data source for Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator
  constructor(
    private router: Router,
    private commanApiService: MarketingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.switchTab(this.activeTab); // Load default tab data
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }
  // Switch tabs and fetch data accordingly
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.updateDisplayedColumns(); // Update columns based on tab
    this.loadLeads(); // Fetch data for the selected tab
  }

  // Update displayed columns based on the active tab
  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'id',
      'organizationName',
      'salesperson',
      'reporedDate',
      'cityName',
      'pocName',
      'pocContact',
      'insight',
      'actions', // Actions available in all tabs
    ];
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

  // Move Rejected lead to Progressive
  moveToProgressive(lead: any): void {
    if (confirm('Are you sure you want to move this lead to Progressive?')) {
      // const dialogRef = this.dialog.open(LeadManagementEditComponent, {
      //   width: '400px',
      //   data: { lead }, // Pass the lead object to the dialog
      // });

      // dialogRef.afterClosed().subscribe((result) => {
      //   if (result === 'updated') {
      //     this.loadLeads(); // Reload leads after successful status update
      //   }
      // });

      const payload = {
        leadID: lead.leadID,
        salesPersonID: parseInt(localStorage.getItem('UserID') || '0', 10),
        status: 1, // Progressive status
      };

      this.commanApiService.updateLeadStatus(payload).subscribe(
        () => {
          alert('Lead marked as Progressive successfully!');
          this.loadLeads(); // Reload leads after update
        },
        (error) => {
          console.error('Failed to update lead status:', error);
          alert('Failed to update the lead. Please try again.');
        }
      );
    }
  }

  // Mark Progressive lead as Rejected
  rejectLead(lead: any): void {
    if (confirm('Are you sure you want to mark this lead as Rejected?')) {
      const payload = {
        leadID: lead.leadID,
        salesPersonID: parseInt(localStorage.getItem('UserID') || '0', 10),
        status: 3, // Rejected status
      };

      this.commanApiService.updateLeadStatus(payload).subscribe(
        () => {
          alert('Lead marked as Rejected successfully!');
          this.loadLeads(); // Reload leads after update
        },
        (error) => {
          console.error('Failed to update lead status:', error);
          alert('Failed to update the lead. Please try again.');
        }
      );
    }
  }
}
