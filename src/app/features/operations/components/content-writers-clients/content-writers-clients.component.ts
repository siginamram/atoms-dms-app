import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-content-writers-clients',
  standalone: false,
  templateUrl: './content-writers-clients.component.html',
  styleUrls: ['./content-writers-clients.component.css'],
   providers: [provideMomentDateAdapter(MY_FORMATS)],
       changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentWritersClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  leads: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';
  selectedDate:any='';
  isLoading = false; // Initially set to true
  clientNameFilter = new FormControl(''); // **Filter for Client Name**
  activeFilters: { [key: string]: boolean } = {}; // **Track Active Filters**
  readonly date = new FormControl(moment().add(1, 'month').startOf('month'));
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from local storage

  displayedColumns: string[] = [
    'id',
    'organizationName',
    'clientCategory',
    'noOfPosters',
    'totContentApprovedCount',
    'percentOfPosters',
    'noOfGraphicReels',
    'totGraphicApprovedCount',
    'percentOfGraphicReels',
    'actions',
  ];

  dataSource1 = new MatTableDataSource<any>([]); // Empty dataset initially

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.fetchClients();
    this.dataSource1.filterPredicate = (data: any) => 
      !this.clientNameFilter.value || 
      data.organizationName.toLowerCase().includes(this.clientNameFilter.value.toLowerCase());
  
    this.clientNameFilter.valueChanges.subscribe(() => this.applyFilter());
  }
  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator; // Assign paginator after view initialization
  }
  // Fetch clients based on selected date and user ID
  fetchClients(): void {
    this.isLoading = true;
    this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Default day is 01
    if (this.userId) {
      this.operationsService
        .getClientsByContentWriter(this.userId, this.selectedDate)
        .subscribe(
          (response: any) => {
            this.dataSource1.data = response; // Bind data to the table
            this.filteredClients = response; // For autocomplete
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            console.error('Error fetching clients:', error);
          }
        );
    }
  }
  applyFilter(): void {
    const clientName = this.clientNameFilter.value?.toLowerCase() || '';
  
    this.dataSource1.filterPredicate = (data: any) =>
      !clientName || data.organizationName.toLowerCase().includes(clientName);
  
    this.dataSource1.filter = Math.random().toString(); // Trigger filter refresh
  }
  

  // **Toggle filter visibility**
  toggleFilter(column: string): void {
    this.activeFilters[column] = !this.activeFilters[column];
  }

  getCategoryLabel(category: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'A',
      2: 'B',
      3: 'C',
    };
    return categoryMap[category] || 'Unknown'; // Default to 'Unknown' for unmapped values
  }
  
  // Filter clients for autocomplete
  filterSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredClients = this.dataSource1.data.filter((client: any) =>
      client.organizationName.toLowerCase().includes(searchTerm)
    );
  }

  // Filter leads by selected client ID
  filterLeads(selectedLeadId: number): void {
    const selectedLead = this.dataSource1.data.find(
      (client: any) => client.clientId === selectedLeadId
    );
    if (selectedLead) {
      this.dataSource1.data = [selectedLead]; // Filter table data
    } else {
      this.dataSource1.data = this.filteredClients; // Reset table data
    }
  }

  // Handle Month and Year selection
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchClients(); // Fetch data for the selected month/year
  }

  // Navigate to edit page
  // editRow(client: any): void {
  //   this.router.navigate([`/home/operations/operations-content-writer`]);
  //   console.log('Edit:', client);
  // }

  editRow(lead: any): void {
    this.router.navigate(['/home/operations/operations-content-writer'], {
      queryParams: {date:this.selectedDate,clientId:lead.clientId },
    });
} 
}