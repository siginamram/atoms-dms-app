import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
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
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignManagementComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly date = new FormControl(moment());
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['sno', 'client', 'noOfCompletedCampaigns', 'action'];
  campaigns: any[] = [];
  selectedDate: string = '';
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); // Get UserID from local storage
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.fetchClients(); // Initial fetch with the current date
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
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

  fetchClients(): void {
    
      // Format date as MM/YYYY
      this.selectedDate =this.date.value?.format('YYYY-MM') + '-01'; // Format date as YYYY-MM-DD

    this.operationsService.getAdCampaignByMonthAndUserId(this.userId,  this.selectedDate).subscribe({
      next: (response) => {
        this.dataSource = response.map((campaign: any) => ({
          clientId: campaign.clientId,
          client: campaign.clientName,
          noOfCompletedCampaigns: campaign.noOfCampaignsCompleted,
        }));
        this.cdr.markForCheck(); // Trigger UI update
      },
      error: (error) => {
        console.error('Error fetching campaigns:', error);
        this.campaigns = []; // Clear campaigns on error
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
