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
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

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
  selector: 'app-content-writers-calendar-export',
  standalone:false,
  templateUrl: './content-writers-calendar-export.component.html',
  styleUrl: './content-writers-calendar-export.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentWritersCalendarExportComponent  implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fullTextDialog') fullTextDialog: any;
  selectedDate: any = '';
  showSpinner: boolean = false;
  readonly date = new FormControl(moment());
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); 
  dataSource = new MatTableDataSource<any>([]);
  tabledata:any[] = [];
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientName: string = '';
  displayedColumns: string[] = [
    'sno',
    'speciality',
    'creativeType',
    'promotionType',
    'language',
    'contentInPost',
    'contentCaption',
  
  ];
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private operationsService: OperationsService
  ) {}
  ngOnInit(): void {
    this.fetchAllClients();
  }

  getpromotionType(status: number): string {
    switch (status) {
      case 1:
        return 'Branding';
      case 2:
        return 'Educational';
      case 3:
        return 'Meme';
      case 4:
        return 'Emergency';
      case 5:
        return 'Special Day';
      default:
        return 'Unknown status';
    }
  } 

  fetchAllClients(): void {
    this.operationsService.getClientsByUser(this.userId).subscribe({
      next: (response: any[]) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      },
    });
  }

  filterClients(event: Event): void {
    const input = event.target as HTMLInputElement;
    const search = input.value.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.organizationName.toLowerCase().includes(search)
    );
  }

  fetchMonthlyTrackerData(): void {
    if (!this.selectedClientName || !this.date.value) {
      console.error('Client or Date is not selected');
      return;
    }
  
    const selectedClient = this.clients.find(
      (client) => client.organizationName === this.selectedClientName
    );
  
    if (!selectedClient) {
      console.error('Selected client not found');
      return;
    }
  
    const selectedMonthYear = this.date.value;
    const formattedDate = moment(selectedMonthYear).startOf('month').format('YYYY-MM-DD'); // Format as YYYY-MM-01
  
    this.showSpinner = true; // Start loading indicator
    this.operationsService.getMonthlyTrackerData(selectedClient.clientId, formattedDate, 0).subscribe({
      next: (response) => {
        this.tabledata=response;
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
          promotionType: this.getpromotionType(item.promotionId),
        }));
        this.showSpinner = false; // Stop loading indicator
        this.dataSource.paginator = this.paginator; // Reassign paginator
      },
      error: (error) => {
        this.showSpinner = false; // Stop loading indicator
        console.error('Error fetching tracker data:', error);
      },
    });
  }
  
  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  
    // Fetch table data for the selected month/year
    this.fetchMonthlyTrackerData();
  }
  
  onClientSelected(event: any): void {
    const selectedOrganizationName = event.option.value;
    this.selectedClientName = selectedOrganizationName;
  
    // Fetch table data for the selected client and month/year
    this.fetchMonthlyTrackerData();
  }
  

    showFullText(text: string, title: string): void {
      this.dialog.open(this.fullTextDialog, {
        width: '400px',
        data: {
          text: text,
          title: title,
        },
      });
    }

    // Existing code...

  /**
   * Export data to Excel
   */
  exportToExcel(): void {
    const exportData = this.dataSource.data.map((item, index) => ({
      SNo: index + 1,
      Speciality: item.speciality,
      CreativeType: item.creativeType,
      PromotionType: item.promotionType,
      Language: item.language,
      ContentCaption: item.contentCaption,
      ContentInPost: item.contentInPost,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Data');

    const fileName = `${this.selectedClientName}_${moment(this.date.value).format('MM-YYYY')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * Export data to PDF
   */
  exportToPDF(): void {
    const doc = new jsPDF();
    const fileName = `${this.selectedClientName}_${moment(this.date.value).format('MM-YYYY')}`;
    // Add a title
    doc.text(fileName, 14, 10);
  
    // Define the table headers and data
    const headers = [['S.No', 'Speciality', 'Creative Type', 'Promotion Type', 'Language','Content In Post','Content Caption']];
    const data = this.dataSource.data.map((row, index) => [
      index + 1,
      row.speciality,
      row.creativeType,
      row.promotionType,
      row.language,
      row.contentCaption,
      row.contentInPost,
    ]);
  
    // Generate the table
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'striped',
    });
  
    // Save the PDF
    doc.save(fileName+'_Calendar_Report.pdf');
  }
  

}
