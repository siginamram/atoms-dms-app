import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { MatPaginator } from '@angular/material/paginator';

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
  selector: 'app-ad-campaign-management',
  standalone: false,
  templateUrl: './ad-campaign-management.component.html',
  styleUrls: ['./ad-campaign-management.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly date = new FormControl(moment()); // Form control for date
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['sno', 'client', 'noOfCompletedCampaigns', 'action'];
  campaigns: any[] = [];
  selectedDate: string = '';
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.fetchClients(); // Fetch data for the current date
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Attach paginator
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue); // Update the form control value
    datepicker.close();

    this.fetchClients(); // Fetch data for the selected date
  }

  fetchClients(): void {
    this.selectedDate = this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-DD

    this.operationsService.getAdCampaignByMonthAndUserId(this.userId, this.selectedDate).subscribe({
      next: (response) => {
        this.dataSource.data = response.map((campaign: any) => ({
          clientId: campaign.clientId,
          client: campaign.clientName,
          noOfCompletedCampaigns: campaign.noOfCampaignsCompleted,
        }));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching campaigns:', error);
        this.dataSource.data = []; // Clear data on error
        this.cdr.markForCheck();
      },
    });
  }

  editCampaign(campaign: any): void {
    this.router.navigate(['/home/operations/ad-campaign-operations-dma'], {
      queryParams: { date: this.selectedDate, clientId: campaign.clientId },
    });
  }
}
