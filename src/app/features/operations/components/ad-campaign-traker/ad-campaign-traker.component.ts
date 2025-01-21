import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
import { AdCampaignTrakerEditComponent } from '../ad-campaign-traker-edit/ad-campaign-traker-edit.component';
import * as moment from 'moment';

@Component({
  selector: 'app-ad-campaign-traker',
  standalone: false,
  templateUrl: './ad-campaign-traker.component.html',
  styleUrls: ['./ad-campaign-traker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignTrakerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // State Variables
  isLoading = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'campaignStartDate',
    'campaignEndDate',
    'platform',
    'objective',
    'reach',
    'impressions',
    'resultType',
    'result',
    'costPerResult',
    'targetAmount',
    'amountSpent',
    'edit',
  ];
  clientForm: FormGroup;
  clientId: number = 0;
  clientName: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private operationsService: OperationsService
  ) {
    this.clientForm = this.fb.group({
      clientName: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  ngOnInit(): void {
    // Retrieve clientId from query params
    this.route.queryParams.subscribe((params) => {
      this.clientId = Number(params['clientId']) || 0;

      // Fetch client details
      this.fetchClientDetails(this.clientId);
      this.fetchFilteredData();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }

  fetchClientDetails(clientId: number): void {
    this.operationsService.getclientByClientId(clientId).subscribe({
      next: (response) => {
        if (response?.organizationName) {
          this.clientForm.patchValue({ clientName: response.organizationName });
          this.clientName = response.organizationName;
        }
      },
      error: (error) => {
        console.error('Error fetching client details:', error);
      },
    });
  }

  fetchFilteredData(): void {
    const from = this.clientForm.get('fromDate')?.value;
    const to = this.clientForm.get('toDate')?.value;

    if (!from || !to) {
      console.error('From and To dates are required!');
      return;
    }

    this.isLoading = true; // Show loader
    const formattedFrom = moment(from).format('YYYY-MM-DD');
    const formattedTo = moment(to).format('YYYY-MM-DD');

    this.operationsService.GetAdCampaignItemsByClientIdAndMonth(this.clientId, formattedFrom, formattedTo).subscribe({
      next: (response) => {
        this.dataSource.data = response.map((item: any) => ({
          ...item,
          platformLabel: this.getPlatformLabel(item.platform),
          objectiveLabel: this.getObjectiveLabel(item.objective),
          resultTypeLabel: this.getResultTypeLabel(item.resultType),
        }));
        this.isLoading = false; // Hide loader
      },
      error: (error) => {
        this.isLoading = false; // Hide loader
        console.error('Error fetching data:', error);
      },
    });
  }

  getPlatformLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Facebook';
      case 2:
        return 'Instagram';
      case 3:
        return 'YouTube';
      default:
        return 'Unknown status';
    }
  } 

  getObjectiveLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Awareness';
      case 2:
        return 'Engagement';
      case 3:
        return 'Traffic';
      case 4:
        return 'Lead Generation';
      default:
        return 'Unknown status';
    }
  } 

  getResultTypeLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Reach';
      case 2:
        return 'Impressions';
      case 3:
        return 'Engagement';
      case 4:
        return 'Profile Visits';
      case 5:
        return 'WA Messages';
      case 6:
          return 'Leads Generation';
      default:
        return 'Unknown status';
    }
  } 

  addNewEntry(): void {
    const dialogRef = this.dialog.open(AdCampaignTrakerEditComponent, {
      width: '600px',
      data: {
        isEdit: false,
        meetingData: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchFilteredData(); // Refresh data
      }
    });
  }

  onEdit(row: any): void {
    console.log('Editing Row Data:', row); // Log the row data to verify
    const dialogRef = this.dialog.open(AdCampaignTrakerEditComponent, {
      width: '600px',
      data: row, // Pass the correct row data for editing
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Campaign Edited:', result);
        this.fetchFilteredData(); // Refresh the data
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/home/operations/ad-campaign-dma']);
  }
}
