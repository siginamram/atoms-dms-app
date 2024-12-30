import { Component, OnInit,ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Moment } from 'moment';
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
  selector: 'app-photo-grapher-complete-history',
  standalone:false,
  templateUrl: './photo-grapher-complete-history.component.html',
  styleUrls: ['./photo-grapher-complete-history.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
         changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrapherCompleteHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  date = new FormControl(moment()); // Form control for Month/Year filter
  dataSource = new MatTableDataSource<any>(); // Data source for the table
  displayedColumns: string[] = [
    'id',
    'date',
    'organizationName',
    'noOfYouTubeVideos',
    'noOfEducationalReels',
    'shootLink',
    'remarks',
  ]; // Columns to display

  constructor(private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.fetchData(); // Fetch initial data
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }
  // Automatically fetch data when Month and Year are selected
  onMonthSelected(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const selectedDate = normalizedMonthAndYear.format('YYYY-MM-01'); // Format date as YYYY-MM-DD
    this.date.setValue(moment(selectedDate)); // Update the control value
    datepicker.close();
    console.log('Fetching data for:', selectedDate);
    this.fetchData(selectedDate);
  }

  // Fetch data from the API
  fetchData(date: string = moment().format('YYYY-MM-01')): void {
    this.operationsService.ShootHistoryByMonth(date).subscribe({
      next: (response) => {
        console.log('Fetched Data:', response);
        this.dataSource.data = response; // Update table data
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
}
