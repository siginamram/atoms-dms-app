import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { OperationsService } from '../../services/operations.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-ad-campaign-reports',
  standalone: false,
  templateUrl: './ad-campaign-reports.component.html',
  styleUrl: './ad-campaign-reports.component.css',
    providers: [provideMomentDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignReportsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  showSpinner: boolean = false;
  fromDateValue: any | null = null;
  toDateValue: any | null = null;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['sno', 'organizationName', 'campaignStartDate', 'campaignEndDate', 'reach', 'impressions','resultType','result','followersIncreased','currentFollowers'];
  resultType:any = {
    1: "Reach",
    2: "Impressions",
    3: "Engagement",
    4: "ProfileVisits",
    5: "WAMessages",
    6: "LeadGenerated"
  }

  constructor(private operationService:OperationsService,private cdr: ChangeDetectorRef){}

  ngOnInit(){
    const today = new Date();
    this.fromDateValue = today;
    this.toDateValue = today;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Attach paginator
  }

  fetchAdCampaignOverview(): void {
    this.showSpinner = true;
    const userId = +localStorage.getItem('UserID')!; 
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);

    this.operationService.getAdCampaignReportByDateRangeAndDmaId(userId, fdate, tdate).subscribe({
      next: (response) => {
        this.dataSource.data = response.map((campaign: any) => ({
          organizationName: campaign.organizationName,
          campaignStartDate:this.formatDisplayDate(campaign.campaignStartDate),
          campaignEndDate: this.formatDisplayDate(campaign.campaignEndDate),
          reach: campaign.reach,
          impressions: campaign.impressions,
          resultType: this.resultType[campaign.resultType],
          result: campaign.result,
          followersIncreased: campaign.followersIncreased,
          currentFollowers: campaign.currentFollowers
        }));
        this.cdr.markForCheck();
        this.showSpinner = false;
    },
    error: (error) => {
      console.error('Error fetching Ad Reports:', error);
      this.dataSource.data = []; // Clear data on error
      this.cdr.markForCheck();
      this.showSpinner = false;
    }
  }
    );
  }


  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  formatDisplayDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }

}
