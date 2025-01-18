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
  selector: 'app-dma-clients',
 standalone:false,
  templateUrl: './dma-clients.component.html',
  styleUrl: './dma-clients.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DmaClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedDate: any = '';
  dataSource1 = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'sno',
    'clientName',
    'contentApproved',
    'postersApproved',
    'graphicVideosApproved',
    'educationalVideosApproved',
    'youtubeVideosApproved',
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

  fetchClients(): void {
    this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-DD
    if (!this.selectedDate || !this.userId) {
      console.warn('Missing date or userId');
      return;
    }

    this.operationsService.getClientsByGraphicReelEditor(this.userId, this.selectedDate).subscribe({
      next: (response: any[]) => {
        console.log('Fetched Clients:', response);
        this.dataSource1.data = response.map((client, index) => ({
          ...client,
          clientName: client.organizationName,
          contentApproved: client.totContentApprovedPercent || 0,
          postersApproved: client.totPostersApprovedPercent || 0,
          graphicVideosApproved: client.totGraphicVideosApprovedPercent || 0,
          educationalVideosApproved: client.totEducationalVideosApprovedPercent || 0,
          youtubeVideosApproved: client.totYouTubeVideosApprovedPercent || 0,
        }));
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
        this.dataSource1.data = []; // Clear table on error
      },
    });
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
    this.router.navigate(['/home/operations/operations-dma'], {
      queryParams: { date: this.selectedDate, clientId: client.clientId },
    });
  }
}