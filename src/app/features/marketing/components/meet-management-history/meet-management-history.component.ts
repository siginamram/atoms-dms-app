import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-meet-management-history',
  standalone:false,
  templateUrl: './meet-management-history.component.html',
  styleUrls: ['./meet-management-history.component.css']
})
export class MeetManagementHistoryComponent implements OnInit {
  leads: any[] = []; // List of leads
  filteredLeads: any[] = []; // Filtered list of leads for autocomplete
  searchTerm: string = ''; // Stores selected or searched organizationName
  selectedLeadId: any | null = null; // Stores the selected LeadID
  meetingHistory: any[] = []; // Meeting history for the selected LeadID
  dataSource = new MatTableDataSource<any>(this.meetingHistory); // Data source for the table
  displayedColumns = [
    'sno',
    'organization',
    'salesperson',
    'scheduledDate',
    'scheduledTime',
    'travellingDuration',
    'waitingTime',
    'meetingTime',
    'status',
    'insight'
    
  ]; // Columns for the table

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showSpinner: boolean = false;

  constructor(private marketingService: MarketingService) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('UserID')); // Fetch user ID from local storage
    if (userId) {
      this.getLeads(userId); // Fetch leads for the user
    } else {
      console.error('No UserID found in local storage');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch leads by userId
  getLeads(userId: number): void {
    this.showSpinner = true
    this.marketingService.getLeadsByUserId(userId).subscribe({
      next: (response: any[]) => {
        this.leads = response;
        this.filteredLeads = response; // Initialize filtered leads
        this.showSpinner = false;
      },
      error: (err) => {
        this.showSpinner = false;
        console.error('Error fetching leads:', err)
      }
    });
  }

  // Fetch meeting history by leadId
  getMeetingHistory(leadId: number): void {
    this.showSpinner = true
    this.marketingService.getMeetingHistoryByLeadId(leadId).subscribe({
      next: (response: any[]) => {
        // Transform statusOfLead to human-readable text
        this.meetingHistory = response.map(meeting => ({
          ...meeting,
          statusOfLead: this.getStatusLabel(meeting.statusOfLead) // Transform status
        }));
        this.dataSource.data = this.meetingHistory; // Update table data
        this.showSpinner = false;
      },
      error: (err) =>{ this.showSpinner = false;
         console.error('Error fetching meeting history:', err)
      }
    });
  }
  
  // Helper method to map status values to labels
  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Active';
      case 2: return 'Converted';
      case 3: return 'Rejected';
      case 4: return 'Positive';
      case 5: return 'Neutral';
      default: return 'Unknown';
    }
  }
  

  // Filter leads based on the search input
  filterSearch(): void {
    this.filteredLeads = this.leads.filter(lead =>
      lead.organizationName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Handle lead selection
  filterLeads(selectedLead: any): void {
    const selectedLeadData = this.leads.find(lead => lead.leadID === selectedLead);
    if (selectedLeadData) {
      this.searchTerm = selectedLeadData.organizationName; // Display organizationName in input
      this.selectedLeadId = selectedLeadData.leadID; // Set the selected LeadID
      this.getMeetingHistory(this.selectedLeadId); // Fetch meeting history for the selected LeadID
    }
  }
}
