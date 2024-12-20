import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sales-converted-list',
  templateUrl: './sales-converted-list.component.html',
  styleUrls: ['./sales-converted-list.component.css']
})
export class SalesConvertedListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchTerm: string = ''; // Search input value
  leads: any[] = []; // Full list of leads
  filteredLeads: any[] = []; // Filtered list for autocomplete
  constructor(private router: Router,  private commanApiService: MarketingService) {}
  cityFilter: string = '';
  displayedColumns: string[] = [
    'id',
    'clientName',
    'dealClosingDate',
    'ktStatus',
    'ktDate',
    'payment',
    'city',
    'actions'
  ];

  dataSource = [
    { clientName: 'John Doe', dealClosingDate: new Date(), ktStatus: 'Completed', ktDate: new Date(), payment: 'Paid', city: 'New York' },
    { clientName: 'Jane Smith', dealClosingDate: new Date(), ktStatus: 'In Progress', ktDate: new Date(), payment: 'Pending', city: 'Los Angeles' },
    { clientName: 'Bob Johnson', dealClosingDate: new Date(), ktStatus: 'Completed', ktDate: new Date(), payment: 'Paid', city: 'Chicago' },
  ];
  dataSource1 = new MatTableDataSource<any>([]); // Data source for the table

  cities: string[] = ['New York', 'Los Angeles', 'Chicago'];
  filteredData = [...this.dataSource];

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
        this.dataSource1.data = this.leads; // Set data for the table
        this.dataSource1.paginator = this.paginator; // Attach paginator
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
      this.dataSource1.data = [selectedLead]; // Filter the table for the selected lead
    } else {
      this.searchTerm = ''; // Clear if no valid selection
      this.dataSource1.data = this.leads; // Reset the table
    }
  }
  

  editRow() {
    //console.log('Editing row:', row);
    // Implement edit functionality here
    this.router.navigate(['/home/marketing/sales-convert-status-edit']);
  }
}
