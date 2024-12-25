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
  selector: 'app-photo-grapher-clients',
 standalone:false,
  templateUrl: './photo-grapher-clients.component.html',
  styleUrl: './photo-grapher-clients.component.css',
     providers: [provideMomentDateAdapter(MY_FORMATS)],
     changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrapherClientsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  leads: any[] = [];
  searchTerm: string = '';
  formattedMonthYear: string = '';
  readonly date = new FormControl(moment());
  
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'cityName',
    'isKTCompleted',
    'noOfReels',
    'reelsPer',
    'actions',
  ];

  dataSource1 = new MatTableDataSource<any>([
    {
      id: 1,
      organizationName: 'Client A',
      cityName: 'Hyderabad',
      isKTCompleted: 'Completed',
      noOfReels: 20,
      reelsPer: '75%',
      date: '2024-12-01',
    },
    {
      id: 2,
      organizationName: 'Client B',
      cityName: 'Bangalore',
      isKTCompleted: 'Pending',
      noOfReels: 15,
      reelsPer: '50%',
      date: '2024-11-10',
    },
    {
      id: 3,
      organizationName: 'Client C',
      cityName: 'Chennai',
      isKTCompleted: 'Completed',
      noOfReels: 25,
      reelsPer: '85%',
      date: '2024-10-05',
    },
  ]);

  constructor(private cdr: ChangeDetectorRef,private router: Router,private operationsService: OperationsService ) {}

  ngOnInit(): void {
    this.dataSource1.paginator = this.paginator; // Attach paginator
  }
// Filter leads for autocomplete
filterSearch(): void {
  const searchTerm = this.searchTerm.toLowerCase();
  this.leads = this.leads.filter((lead) =>
    lead.organizationName.toLowerCase().includes(searchTerm)
  );
}

// Filter leads by selected client ID
filterLeads(selectedLeadId: number): void {
  const selectedLead = this.leads.find((lead) => lead.leadId === selectedLeadId);
  if (selectedLead) {
    this.searchTerm = selectedLead.organizationName;
    this.dataSource1.data = [selectedLead];
  } else {
    this.dataSource1.data = this.leads;
  }
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
  // Reset table data to the original dataset
  resetTableData(): void {
    this.dataSource1.data = [
      {
        id: 1,
        organizationName: 'Client A',
        cityName: 'Hyderabad',
        isKTCompleted: 'Completed',
        isAdvReceived: '50%',
        noOfReels: 20,
        reelsPer: '75%',
        noOfGraphicReels: 5,
        graphicReelsPer: '25%',
        clientId: 101,
        date: '2024-12-01',
      },
      {
        id: 2,
        organizationName: 'Client B',
        cityName: 'Bangalore',
        isKTCompleted: 'Pending',
        isAdvReceived: '30%',
        noOfReels: 15,
        reelsPer: '50%',
        noOfGraphicReels: 10,
        graphicReelsPer: '50%',
        clientId: 102,
        date: '2024-11-10',
      },
      {
        id: 3,
        organizationName: 'Client C',
        cityName: 'Chennai',
        isKTCompleted: 'Completed',
        isAdvReceived: '70%',
        noOfReels: 25,
        reelsPer: '85%',
        noOfGraphicReels: 10,
        graphicReelsPer: '15%',
        clientId: 103,
        date: '2024-10-05',
      },
    ];
  }
  // Navigate to edit page
  editRow(client: any): void {
    this.router.navigate([`/home/operations/operations-photo-grapher`]);
    console.log('Edit:', client);
  }
}



