import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
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
  selector: 'app-photo-grapher-operations',
  standalone:false,
  templateUrl: './photo-grapher-operations.component.html',
  styleUrls: ['./photo-grapher-operations.component.css'],
     providers: [provideMomentDateAdapter(MY_FORMATS)],
      //encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrapherOperationsComponent {
  // Filters
  searchClient = '';
  filteredClients = ['Client A', 'Client B', 'Client C', 'Client D'];
  categories = ['Reels', 'YouTube Videos', 'Both'];
    formattedMonthYear: string = '';
     readonly date = new FormControl(moment());

  // Table Data
  photoData = [
    {
      month: 'January',
      client: 'Client A',
      reelsRequired: 10,
      reelsShot: 8,
      youtubeVideosRequired: 5,
      youtubeVideosShot: 4,
      shootDate: '2024-01-15',
      link: 'http://example.com/shoot-link',
      remarks: 'Pending edits',
    },
    {
      month: 'February',
      client: 'Client B',
      reelsRequired: 15,
      reelsShot: 12,
      youtubeVideosRequired: 8,
      youtubeVideosShot: 6,
      shootDate: '2024-02-10',
      link: 'http://example.com/shoot-link2',
      remarks: 'Approved',
    },
  ];

  displayedColumns = [
    'month',
    'client',
    'reelsRequired',
    'reelsShot',
    'youtubeVideosRequired',
    'youtubeVideosShot',
    'shootDate',
    'link',
    'remarks',
  ];
  constructor(private cdr: ChangeDetectorRef, private router: Router, private operationsService: OperationsService){}
  // Methods
  filterClients() {
    const search = this.searchClient.toLowerCase();
    this.filteredClients = ['Client A', 'Client B', 'Client C', 'Client D'].filter(client =>
      client.toLowerCase().includes(search)
    );
  }

  selectClient(client: string) {
    console.log('Selected Client:', client);
  }

 setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
     const ctrlValue = this.date.value ?? moment();
     ctrlValue.month(normalizedMonthAndYear.month());
     ctrlValue.year(normalizedMonthAndYear.year());
     this.date.setValue(ctrlValue);
     datepicker.close();
   }
 
   onMonthYearSelected(event: moment.Moment, datepicker: any): void {
     if (event && event.isValid && event.isValid()) {
       // Format the selected date as MM/YYYY
       this.formattedMonthYear = event.format('MM/YYYY');
       console.log('Selected Month/Year:', this.formattedMonthYear);
 
       // Close the datepicker
       datepicker.close();
 
       // Trigger Angular change detection
       this.cdr.detectChanges();
     } else {
       console.error('Invalid date selected:', event);
     }
   }
}
