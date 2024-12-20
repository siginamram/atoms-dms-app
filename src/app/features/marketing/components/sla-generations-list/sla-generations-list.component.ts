import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MarketingService } from '../../services/marketing.service'; // Ensure the correct path

@Component({
  selector: 'app-sla-generations-list',
  templateUrl: './sla-generations-list.component.html',
  styleUrls: ['./sla-generations-list.component.css'],
})
export class SlaGenerationsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchTerm: string = ''; // Search input value
  leads: any[] = []; // Full list of leads
  filteredLeads: any[] = []; // Filtered list for autocomplete
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'salesperson',
    'reportedDate',
    'cityName',
    'pocName',
    'pocContact',
    'insight',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]); // Data source for the table

  constructor(
    private router: Router,
    private commanApiService: MarketingService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  // Load leads from the API
  loadLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = 2;

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any[]) => {
        this.leads = data || [];
        this.filteredLeads = [...this.leads]; // Initialize filtered leads
        this.dataSource.data = this.leads; // Set data for the table
        this.dataSource.paginator = this.paginator; // Attach paginator
      },
      (error) => {
        console.error('Failed to fetch leads:', error);
        this.leads = [];
        this.filteredLeads = [];
      }
    );
  }

  // Filter leads for autocomplete
  filterSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredLeads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(searchTerm)
    );
  }

  // On selecting a lead, filter table data
  filterLeads(selectedLeadId: number): void {
    const selectedLead = this.leads.find((lead) => lead.leadID === selectedLeadId);
    if (selectedLead) {
      this.searchTerm = selectedLead.organizationName; // Set the organizationName in the search box
      this.dataSource.data = [selectedLead]; // Filter the table for the selected lead
    } else {
      this.searchTerm = ''; // Clear if no valid selection
      this.dataSource.data = this.leads; // Reset the table
    }
  }
  

  // View SLA details
  viewSLA(id: number): void {
    this.router.navigate([`/home/marketing/generate-sla/${id}`]);
  }
}
