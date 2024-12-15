import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MarketingService } from '../../services/marketing.service';  // Update with correct service path

@Component({
  selector: 'app-sla-generations-list',
  templateUrl: './sla-generations-list.component.html',
  styleUrls: ['./sla-generations-list.component.css'],
})
export class SlaGenerationsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator
  constructor(
    private router: Router,
    private commanApiService: MarketingService // Ensure correct service is used
  ) {}

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

  filteredLeads: any[] = []; // Stores the filtered leads fetched from API

  ngOnInit(): void {
    this.loadLeads(); // Load leads on component initialization
  }

  loadLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = 2; // Example status to filter leads

    this.commanApiService.getLeadsByStatusAndRole(userId, status).subscribe(
      (data: any) => {
        console.log(`Fetched Leads:`, data);
        this.filteredLeads = data; // Bind fetched data to the table
      },
      (error) => {
        console.error('Failed to fetch leads:', error);
        this.filteredLeads = []; // Clear the table if there is an error
      }
    );
  }

  // generateSLA(): void {
  //   this.router.navigate(['/home/marketing/generate-sla']);
  // }

  viewSLA(id: number): void {
    // Update this to match the actual route in your app
    this.router.navigate([`/home/marketing/generate-sla/${id}`]);
  }
}
