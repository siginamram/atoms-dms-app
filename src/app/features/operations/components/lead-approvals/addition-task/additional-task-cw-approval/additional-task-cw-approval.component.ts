import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { OperationsService } from 'src/app/features/operations/services/operations.service'; 
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { AdditionalTaskEditStatusApprovalComponent } from '../additional-task-edit-status-approval/additional-task-edit-status-approval.component';

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
  selector: 'app-additional-task-cw-approval',
  standalone: false,
  templateUrl: './additional-task-cw-approval.component.html',
  styleUrl: './additional-task-cw-approval.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalTaskCwApprovalComponent implements OnInit {
  @Input() selectedDate!: moment.Moment | null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild('fullTextDialog') fullTextDialog: any;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); 
  RoleId: number = parseInt(localStorage.getItem('RoleId') || '0', 10);
  isLoading = false;
  dateStr:any;
  type:number = 1; // For CW
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
        this.dateStr = today;
  // this.date.valueChanges.subscribe(val => {
  //   if (val && this.type) this.fetchTableData(); // ✅ Ensure type is set
  // });
 

    this.displayedColumns = [
    'sno',
    'clientName',
    'creativeType',
     'deadline',
    'task',
    'contentwriter',
    'content',
    'sendForApprovalOn',
    'contentStatus',
    'remarks',
    'referenceLink',
    'actions'
     ]; 
  this.fetchTableData();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate) {
      this.dateStr = this.selectedDate.format('YYYY-MM') + '-01';
      this.fetchTableData();
    }
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
      let ctrlValue = this.date.value ?? moment(); // fallback to current month
      ctrlValue = ctrlValue.clone().month(normalizedMonthAndYear.month()).year(normalizedMonthAndYear.year());
      this.date.setValue(ctrlValue);
      datepicker.close();
      this.fetchTableData(); // call updated function
    }

  fetchTableData(): void {
    this.isLoading = true;
    this.operationsService.GetAdditionalTasksApprovals(this.userId,this.type,this.dateStr).subscribe({
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
      3: 'PPT',
      4: 'Templates',
      5: 'Posters',
      6: 'Flyers',
      7: 'Graphic Video',
      8: 'General Video', 
      9: 'Podcast',
      10: 'Flexi',
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
  const dialogRef = this.dialog.open(AdditionalTaskEditStatusApprovalComponent, {
    width: '600px',
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
      type: 3, // 1 for CW, 2 for Designer
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
