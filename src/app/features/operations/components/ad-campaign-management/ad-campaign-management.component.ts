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
  selector: 'app-ad-campaign-management',
  standalone:false,
  templateUrl: './ad-campaign-management.component.html',
  styleUrl: './ad-campaign-management.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignManagementComponent {
    selectedDate:any='';
    readonly date = new FormControl(moment());
  displayedColumns: string[] = ['sno','client', 'noOfCompletedCampaigns', 'action'];
  campaigns = [
    { client: 'Client A',  noOfCompletedCampaigns: 3 },
    { client: 'Client B',  noOfCompletedCampaigns: 7 },
    { client: 'Client C', noOfCompletedCampaigns: 2 }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private operationsService: OperationsService
  ) {}

 // Handle Month and Year selection
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    //this.fetchClients(); // Fetch data for the selected month/year
  }

  editCampaign(campaign: any): void {
    console.log('Editing campaign:', campaign);
    // Add your edit logic here
    this.router.navigate(['/home/operations/ad-campaign-operations-dma'], {
      queryParams: {date:this.selectedDate,clientId:campaign.clientId },
    });
  }
}
