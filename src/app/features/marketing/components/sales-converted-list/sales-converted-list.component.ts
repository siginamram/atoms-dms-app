import { Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sales-converted-list',
  standalone:false,
  templateUrl: './sales-converted-list.component.html',
  styleUrls: ['./sales-converted-list.component.css'],
})
export class SalesConvertedListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchTerm: string = ''; // Search input value
  leads: any[] = []; // Full list of leads for filtering
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'ktStatus',
    'ktDate',
    'payment',
   
    'cityName',
    'actions',
  ];
  dataSource1 = new MatTableDataSource<any>([]); // Data source for the table

  constructor(
    private router: Router,
    private commanApiService: MarketingService
  ) {}

  ngOnInit(): void {
    this.loadTableData(); // Fetch table data on initialization
    this.loadLeadsForFilter(); // Fetch leads for filtering
  }

  // Load table data directly from the API
  loadTableData(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);

    this.commanApiService.GetClientKTStatus(userId).subscribe(
      (data: any[]) => {
        this.dataSource1.data = data.map((item, index) => ({
          id: index + 1,
          ...item,
        }));
        this.dataSource1.paginator = this.paginator; // Attach paginator
      },
      (error) => {
        console.error('Failed to fetch table data:', error);
        this.dataSource1.data = [];
      }
    );
  }

  // Load leads for filtering (Autocomplete)
  loadLeadsForFilter(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);

    this.commanApiService.GetClientKTStatus(userId).subscribe(
      (data: any[]) => {
        this.leads = data || [];
      },
      (error) => {
        console.error('Failed to fetch leads for filtering:', error);
        this.leads = [];
      }
    );
  }

  // Filter leads for autocomplete
  filterSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.leads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(searchTerm)
    );
  }

  // On selecting a lead, filter table data
  filterLeads(selectedLeadId: number): void {
    const selectedLead = this.leads.find((lead) => lead.leadId === selectedLeadId);
    if (selectedLead) {
      this.searchTerm = selectedLead.organizationName;
      this.dataSource1.data = [selectedLead];
    } else {
      this.dataSource1.data = this.leads;
    }
  }

  // Navigate to edit page
  editRow(lead: any): void {
    this.router.navigate(['/home/marketing/sales-convert-status-edit'], {
      queryParams: { leadId: lead.leadId,clientid:lead.clientId },
    });
  }
}
