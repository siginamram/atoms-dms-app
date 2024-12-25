import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-poster-designer-operations',
  standalone:false,
  templateUrl: './poster-designer-operations.component.html',
  styleUrls: ['./poster-designer-operations.component.css'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterDesignerOperationsComponent {
  // Filters
  searchClient = '';
  filteredClients = ['Client A', 'Client B', 'Client C', 'Client D'];
  categories = ['Posters', 'Videos', 'Reels', 'Others'];
  internalStatuses = ['Approved', 'Sent for Approval', 'Changes Recommended', 'Sent to Client Approval'];
  clientStatuses = ['Approved', 'Rejected', 'Changes Recommended', 'Sent for Approval'];
    formattedMonthYear: string = '';
    readonly date = new FormControl(moment());
  // Table Data
  contentData = [
    {
      date: '2024-01-01',
      client: 'Client A',
      speciality: 'Cardiology',
      category: 'Posters',
      caption: 'Sample Caption',
      contentLink: 'http://example.com/content',
      internalApproval: 'Approved',
      clientApproval: 'Sent for Approval',
      relatedRemarks: 'Urgent Review Required',
    },
    {
      date: '2024-01-02',
      client: 'Client B',
      speciality: 'Neurology',
      category: 'Videos',
      caption: 'Another Caption',
      contentLink: 'http://example.com/content2',
      internalApproval: 'Sent for Approval',
      clientApproval: 'Approved',
      relatedRemarks: 'Good to go',
    },
  ];

  displayedColumns = [
    'date',
    'client',
    'speciality',
    'category',
    'caption',
    'contentLink',
    'internalApproval',
    'clientApproval',
    'relatedRemarks',
  ];
constructor( private cdr: ChangeDetectorRef,private router: Router, private operationsService: OperationsService){}
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
