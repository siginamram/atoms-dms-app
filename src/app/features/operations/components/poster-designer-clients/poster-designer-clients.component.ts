import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
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
  selector: 'app-poster-designer-clients',
  standalone:false,
  templateUrl: './poster-designer-clients.component.html',
  styleUrl: './poster-designer-clients.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterDesignerClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedDate:any='';
  isLoading = false; // Initially set to true
  dataSource1 = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'clientCategory',
    'noOfPosters',
    'percentOfPosterContentApproved',
    'totPostersApprovedCount',
    'percentOfPostersApproved',
    'actions',
  ];

  readonly date = new FormControl(moment());
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from local storage

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.dataSource1.paginator = this.paginator; // Attach paginator
    this.fetchClients(); // Fetch initial data
  }
  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator; // Assign paginator after view initialization
  }
  fetchClients(): void {
    this.isLoading = true;
    this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-DD
    if (!this.selectedDate || !this.userId) {
      console.warn('Missing date or userId');
      return;
    }

    this.operationsService.getClientsByGraphicDesigner(this.userId, this.selectedDate).subscribe({
      next: (response: any[]) => {
        console.log('Fetched Clients:', response);
        this.dataSource1.data = response.map((client, index) => ({
          ...client,
          id: index + 1, // Add serial number dynamically
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching clients:', error);
        this.dataSource1.data = []; // Clear table on error
      },
    });
  }
  getCategoryLabel(category: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'A',
      2: 'B',
      3: 'C',
    };
    return categoryMap[category] || 'Unknown'; // Default to 'Unknown' for unmapped values
  }
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.fetchClients(); // Fetch data for the selected month/year
  }

  editRow(client: any): void {
    this.router.navigate(['/home/operations/operations-poster-designer'], {
      queryParams: {date:this.selectedDate,clientId:client.clientId },
    });
}
}
