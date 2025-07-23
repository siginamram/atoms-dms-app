import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { AdditionalTaskClientsEditComponent } from '../additional-task-clients-edit/additional-task-clients-edit.component';

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
  selector: 'app-additional-task-clients',
  standalone:false,
  templateUrl: './additional-task-clients.component.html',
  styleUrl: './additional-task-clients.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalTaskClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild('fullTextDialog') fullTextDialog: any;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); 
  RoleId: number = parseInt(localStorage.getItem('RoleId') || '0', 10);
  isLoading = false;
  selectedDate: string = '';
  type: any;
  readonly date = new FormControl(moment());  
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  constructor(
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private router: Router
  ) {}

  ngOnInit() {
    const today = moment().format('YYYY-MM-DD');
    this.selectedDate = today;
   
    if(this.RoleId== 10) {
     this.type = 1; // For CW
     this.displayedColumns = [
    'sno',
    'clientName',
    'clientType',
    'creativeType',
    'task',
    'referenceLink',
    'deadline',
    'Status',
      'remarks',
    'actions'
     ];       
    }
    else{
      this.type = 2; // For Designer
         this.displayedColumns = [
    'sno',
    'clientName',
    'clientType',
    'creativeType',
    'task',
    'content',
    'contentStatus',
    'referenceLink',
    'deadline',
    'Status',
   'remarks',
    'actions'
     ]; 
    }
    this.fetchTableData();
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ): void {
    const ctrlValue = moment(this.date.value ?? moment());
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.selectedDate = ctrlValue.startOf('month').format('YYYY-MM-DD');
    datepicker.close();
    this.fetchTableData();
  }

  fetchTableData(): void {
    this.isLoading = true;
    this.operationsService.GetAdditinalTasksForUpdate(this.userId,this.type,this.selectedDate).subscribe({
      next: (response: any[]) => {
        this.dataSource.data = response;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch tasks:', error);
        this.dataSource.data = [];
        this.isLoading = false;
      },
    });
  }

  mapCreativeType(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Logo',
      2: 'Brochure',
      3: 'YouTube Videos',
      4: 'Educational Reels',
      5: 'Posters',
      6: 'General Video',
    };
    return statusMap[status] || 'Unknown Type';
  }

  mapGraphicStatus(status: any): string {
    if (status == null || status === undefined) return 'Unknown Status';

    const statusMap: { [key: number]: string } = {
      1: 'Yet to Start',
      2: 'Draft Saved',
      3: 'Sent for Approval',
      4: 'Changes Recommended',
      5: 'Approved',
      6: 'Sent for Client Approval',
      7: 'Lead approval Completed',
    };

    if (typeof status === 'string') {
      const reverseMap = Object.entries(statusMap).reduce((acc, [key, val]) => {
        acc[val.toLowerCase()] = Number(key);
        return acc;
      }, {} as { [key: string]: number });

      const lower = status.trim().toLowerCase();
      status = reverseMap[lower] !== undefined ? reverseMap[lower] : null;
    }

    status = Number(status);
    return statusMap[status] || 'Unknown Status';
  }

  getStatusClass(status: any): string {
    const statusText = this.mapGraphicStatus(status).toLowerCase().replace(/\s+/g, '-');
    return `status ${'status-' + statusText}`;
  }

editTask(row: any): void {
  const dialogRef = this.dialog.open(AdditionalTaskClientsEditComponent, {
    width: '800px',
    data: {
      id: row.id || 0,
      isExistingClient: row.isExistingClient,
      clientId: row.clientId,
      organizationName: row.organizationName,
      referenceLink: row.referenceLink || '',
      creativeType: row.creativeType,
      deadline: row.deadline,
      task: row.task || '',
      content: row.content || '',
      contentWriter: row.contentWriter || 0,
      contentApprover: row.contentApprover || 0,
      url: row.url || '',
      designer: row.designer || 0,
      designApprover: row.designApprover || 0,
      contentStatus: row.contentStatus || 0,
      designStatus: row.designStatus || 0,
      contentWriterName: row.contentWriterName || '',
      designerName: row.designerName || '',
      contentApproverName: row.contentApproverName || '',
      designApproverName: row.designApproverName || '',
      type: this.type, // 1 for CW, 2 for Designer
      userId: this.userId,
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.fetchTableData(); // reload table if edited
    }
  });
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
}
