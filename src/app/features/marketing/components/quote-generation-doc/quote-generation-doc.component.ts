import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MarketingService } from '../../services/marketing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-generation-doc',
  templateUrl: './quote-generation-doc.component.html',
  styleUrls: ['./quote-generation-doc.component.css']
})
export class QuoteGenerationDocComponent implements OnInit {
  leads: any[] = []; // Full list of leads
  filteredLeads: any[] = []; // Filtered list for autocomplete
  searchTerm: string = ''; // Search input value
  selectedLeadId: any | null = null; // Selected Lead ID

  tableData: any[] = []; // Data for the table
  dataSource = new MatTableDataSource<any>(this.tableData); // Data source for MatTable

  displayedColumns = [
    'date',
    'leadDetails',
    'basePackage',
    'adBudget',
    'posterDesign',
    'graphicReel',
    'educationalReel',
    'youtube',
    'shoots',
    'shootBudget',
    'total',
    'quote',
    'edit'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private marketingService: MarketingService,private router: Router,) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('UserID')); // Fetch User ID from storage
    if (userId) {
      this.getLeads(); // Fetch all leads
    } else {
      console.error('No UserID found in local storage');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch leads using MarketingService
  // getLeads(userId: number): void {
  //   this.marketingService.getLeadsByUserId(userId).subscribe({
  //     next: (response: any[]) => {
  //       this.leads = response;
  //       this.filteredLeads = response; 
  //     },
  //     error: (err) => console.error('Error fetching leads:', err)
  //   });
  // }

  getLeads(): void {
    const userId = Number(localStorage.getItem('UserID')) || 0; // Fetch UserID safely
    const status = 1; // Default status value
  
    if (userId === 0) {
      console.error('Invalid UserID found in local storage');
      this.leads = [];
      this.filteredLeads = [];
      return;
    }
  
    this.marketingService.getLeadsByStatusAndRole(userId, status).subscribe({
      next: (data: any) => {
        this.leads = data || []; // Initialize leads data
        this.filteredLeads = [...this.leads]; // Create a copy for filtering
      },
      error: (error) => {
        console.error('Error fetching leads:', error);
        this.leads = [];
        this.filteredLeads = []; // Clear data on error
      }
    });
  }
  
  // Filter search for autocomplete
  filterSearch(): void {
    this.filteredLeads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // On selecting a lead, fetch table data
  filterLeads(selectedLead: any): void {
    const selectedLeadData = this.leads.find((lead) => lead.leadID === selectedLead);
    if (selectedLeadData) {
      this.searchTerm = selectedLeadData.organizationName;
      this.selectedLeadId = selectedLeadData.leadID;

      // Simulate API call to fetch data for the selected lead
      this.fetchTableData(this.selectedLeadId);
    }
  }

  // Simulated API call to get table data (replace with actual service call)
  fetchTableData(leadId: number): void {
    // Example simulated data for the table
    this.tableData = [
      {
        date: '2024-06-17',
        leadDetails: `Lead ${leadId}`,
        basePackage: 5000,
        adBudget: 2000,
        posterDesign: 'Yes',
        graphicReel: 'No',
        educationalReel: 'Yes',
        youtube: 'Yes',
        shoots: 2,
        shootBudget: 3000,
        total: 10000,
        quote: 'Pending'
      }
    ];

    // Update the MatTable datasource
    this.dataSource.data = this.tableData;
  }
  AddQuote(): void {
    this.router.navigate(['/home/marketing/generate-new-quote']);
  }

  // Edit action for a row
  editRow(row: any): void {
    console.log('Edit Row:', row);
    // Add your edit logic here
  }
}
