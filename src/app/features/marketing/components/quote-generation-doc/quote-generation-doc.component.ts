import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MarketingService } from '../../services/marketing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-generation-doc',
  standalone:false,
  templateUrl: './quote-generation-doc.component.html',
  styleUrls: ['./quote-generation-doc.component.css'],
})
export class QuoteGenerationDocComponent implements OnInit {
  leads: any[] = []; // Full list of leads
  filteredLeads: any[] = []; // Filtered list for autocomplete
  searchTerm: string = ''; // Search input value
  selectedLeadId: any | null = null; // Selected Lead ID
  tableData: any[] = []; // Data for the table
  originalTableData: any[] = []; // Unfiltered data (original dataset)
  dataSource = new MatTableDataSource<any>(this.tableData); // Data source for MatTable
  showSpinner: boolean = false;
  displayedColumns = [
    'id',
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
    'edit',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private marketingService: MarketingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('UserID')); // Fetch User ID from local storage
    if (userId) {
      this.getLeads(userId); // Fetch all leads
      this.fetchAllRecords(userId); // Fetch and display all records by default
    } else {
      console.error('No UserID found in local storage');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch leads using MarketingService
  getLeads(userId: number): void {
    this.showSpinner = true;
    this.marketingService.getQuoteByUserId(userId).subscribe({
      next: (response) => {
        this.leads = [{ leadId: 0, organizationName: 'All' }, ...response]; // Add "All" option
        this.filteredLeads = [...this.leads]; // Copy for filtering
        this.showSpinner = false;
      },
      error: (err) => {
        this.showSpinner = false;
        console.error('Error fetching leads:', err);
      },
    });
  }

  // Fetch all records and display in the table
  fetchAllRecords(userId: number): void {
    this.showSpinner = true;
    this.marketingService.getQuoteByUserId(userId).subscribe({
      next: (response) => {
        this.originalTableData = response.map((item: any) => ({
          leadId: item.leadId, // Ensure this is part of the mapped data
          date: item.date && item.date  !== '0001-01-01T00:00:00' ? new Date(item.date) : new Date(), // Add date dynamically  
          leadDetails: item.organizationName,
          basePackage: item.basePackage,
          adBudget: item.adBudget,
          posterDesign: item.noOfPosters,
          graphicReel: item.noOfGraphicReels,
          educationalReel: item.noOfEducationalReels,
          youtube: item.noOfYouTubeVideos,
          shoots: item.branding,
          shootBudget: 0, // Add shoot budget dynamically if available
          total: item.basePackage + item.adBudget, // Example calculation
          quote: 'Pending',
        }));
  
        // Update tableData and MatTable datasource
        this.tableData = [...this.originalTableData];
        this.dataSource.data = this.tableData;
        this.showSpinner = false;
      },
      error: (err) => {
        console.error('Error fetching all records:', err);
        this.showSpinner = false;
      },
    });
  }
  

  // Filter search for autocomplete
  filterSearch(): void {
    this.filteredLeads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // On selecting a lead, filter table data locally
  filterLeads(selectedLeadId: number): void {
    if (selectedLeadId === 0) {
      // "All" selected, show all records
      this.tableData = [...this.originalTableData];
      this.dataSource.data = this.tableData;
      this.searchTerm = 'All'; // Update search term
      return;
    }

    const selectedLeadData = this.leads.find((lead) => lead.leadId === selectedLeadId);
    if (selectedLeadData) {
      this.searchTerm = selectedLeadData.organizationName; // Set the search term in the input
      this.selectedLeadId = selectedLeadId; // Store the selected lead ID

      // Filter table data locally based on the selected lead
      this.tableData = this.originalTableData.filter(
        (item) => item.leadDetails === selectedLeadData.organizationName
      );

      // Update MatTable datasource
      this.dataSource.data = this.tableData;
    }
  }

  // AddQuote(): void {
  //   this.router.navigate(['/home/marketing/generate-new-quote']);
  // }

 // Edit action for a row
editRow(leadId: number): void {
  if (leadId) {
    this.router.navigate([`/home/marketing/generate-new-quote/${leadId}`]);
    console.log('Edit Row with leadId:', leadId);
  } else {
    console.error('Invalid leadId:', leadId);
  }
}

downloadQuotation(leadId: any){
  if (leadId) {
    this.marketingService.getQuoteByLeadId(leadId).subscribe({
      next: (data: any) => {
        const encodedObject = btoa(JSON.stringify(data))
        this.router.navigate([`/home/marketing/generated-quote-download`],{ queryParams: { data: encodedObject } });
      },
    });
  } else {
    console.error('Invalid leadId:', leadId);
  }
}

}
