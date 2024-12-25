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
  selector: 'app-video-editor-operations',
  standalone:false,
  templateUrl: './video-editor-operations.component.html',
  styleUrls: ['./video-editor-operations.component.css'],
   providers: [provideMomentDateAdapter(MY_FORMATS)],
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoEditorOperationsComponent {
  // Filters
  searchClient = '';
  filteredClients = ['Client A', 'Client B', 'Client C', 'Client D'];
  approvalStatuses = ['Approved', 'Pending'];
    formattedMonthYear: string = '';
    readonly date = new FormControl(moment());

  // Table Data
  videos = [
    {
      month: 'January',
      client: 'Client A',
      videoType: 'Educational Reel',
      rootFolder: 'http://example.com/root-folder',
      videoLink: 'http://example.com/video',
      title: 'Sample Video Title',
      description: 'A brief description of the video.',
      approvalStatus: 'Pending',
      remarks: '',
      thumbnail: 'http://example.com/thumbnail.jpg',
    },
    {
      month: 'February',
      client: 'Client A',
      videoType: 'YouTube Video',
      rootFolder: 'http://example.com/root-folder2',
      videoLink: 'http://example.com/video2',
      title: 'Another Video Title',
      description: 'Another brief description.',
      approvalStatus: 'Approved',
      remarks: 'Well done',
      thumbnail: 'http://example.com/thumbnail2.jpg',
    },
  ];

  displayedColumns = [
    'month',
    'client',
    'videoType',
    'rootFolder',
    'videoLink',
    'title',
    'description',
    'approvalStatus',
    'remarks',
    'thumbnail',
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

  updateApproval(video: any) {
    console.log('Updated Approval:', video);
  }
}
