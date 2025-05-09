import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-content-writer-videos-clients',
  standalone:false,
  templateUrl: './content-writer-videos-clients.component.html',
  styleUrl: './content-writer-videos-clients.component.css',
     providers: [provideMomentDateAdapter(MY_FORMATS)],
     changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentWriterVideosClientsComponent implements OnInit {
  selectedDate: any = '';
  showSpinner: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  formattedMonthYear: string = '';
  readonly date = new FormControl(moment());
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from local storage
  clientNameFilter = new FormControl(''); // **Filter for Client Name**
  activeFilters: { [key: string]: boolean } = {}; // **Track Active Filters**
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'clientCategory',
    'noOfYouTubeVideos',
     'totYouTubeVideosApprovedCount',
    'percentOfYouTubeVideosApproved',
    'noOfEducationalReels',
    'totEducationalReelsApprovedCount',
    'percentOfEducationalReelsApproved',
    'actions',
  ];

  dataSource1 = new MatTableDataSource<any>([]);

  constructor(private cdr: ChangeDetectorRef, private operationsService: OperationsService, private router: Router) {}

  ngOnInit(): void {
    this.dataSource1.paginator = this.paginator; // Attach paginator
    this.fetchClients(); // Fetch initial data
    this.dataSource1.filterPredicate = (data: any) => 
      !this.clientNameFilter.value || 
      data.organizationName.toLowerCase().includes(this.clientNameFilter.value.toLowerCase());
  
    this.clientNameFilter.valueChanges.subscribe(() => this.applyFilter());
  }
  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator; // Assign paginator after view initialization
  }
  fetchClients(): void {
    this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-DD
    if (!this.selectedDate || !this.userId) {
      console.warn('Missing date or userId');
      return;
    }
    this.showSpinner = true;
    this.operationsService.getClientsVideosByContentWriter(this.userId, this.selectedDate).subscribe({
      next: (response: any[]) => {
        this.showSpinner = false;
        this.dataSource1.data = response.map((client, index) => ({
          id: index + 1,
          organizationName: client.organizationName,
          cityName: client.cityName,
          clientCategory: this.getCategoryLabel(client.clientCategory),
          noOfYouTubeVideos: client.noOfYouTubeVideos,
          noOfEducationalReels: client.noOfEducationalReels,
          totYouTubeVideosApprovedCount: client.totYouTubeVideosApprovedCount,
          totEducationalReelsApprovedCount: client.totEducationalReelsApprovedCount,
          percentOfYouTubeVideosApproved: client.percentOfYouTubeVideosApproved,
          percentOfEducationalReelsApproved: client.percentOfEducationalReelsApproved,
          clientId: client.clientId,
        }));
        this.cdr.markForCheck(); // Trigger change detection
      },
      error: (error) => {
        this.showSpinner = false;
        console.error('Error fetching clients:', error);
        this.dataSource1.data = []; // Clear table on error
      },
    });
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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value || moment(); // Use moment() as fallback
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchClients(); // Fetch clients for the selected month and year
  }
  
  

  editRow(client: any): void {
    this.router.navigate(['/home/operations/operations-videos-content-writer'], {
      queryParams: { date: this.selectedDate, clientId: client.clientId },
    });
  }
}



