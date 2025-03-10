import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-adcampaignsummary-report',
  standalone: false,
  templateUrl: './adcampaignsummary-report.component.html',
  styleUrls: ['./adcampaignsummary-report.component.css']
})
export class AdcampaignsummaryReportComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'clientName',
    'resultType',
    'NoOfCampaigns',
    'CampaignDuration',
    'totalReach',
    'totalImpressions',
    'FollowersIncreased',
    'CurrentFollowers',
    'totalAmountSpent',
  
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Date Range Filters
  fromDate = new FormControl(moment().startOf('month').toDate());
  toDate = new FormControl(moment().endOf('month').toDate());
  clientNameFilter = new FormControl(''); // **Filter for Client Name**
  activeFilters: { [key: string]: boolean } = {}; // **Track Active Filters**
  userId = localStorage.getItem('UserID') ? Number(localStorage.getItem('UserID')) : 0;

  constructor(  private dashboardService: DashboardService,) {}

  ngOnInit(): void {
    this.fetchCampaignSummary();
    this.dataSource.filterPredicate = (data: any) => 
      !this.clientNameFilter.value || 
      data.clientName.toLowerCase().includes(this.clientNameFilter.value.toLowerCase());
  
    this.clientNameFilter.valueChanges.subscribe(() => this.applyFilter());
  }

  fetchCampaignSummary(): void {
    if (!this.userId) {
      console.error('UserID not found in local storage');
      return;
    }
  
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');
  
    const resultTypeMap: any = {
      1: "Reach",
      2: "Impressions",
      3: "Engagement",
      4: "Profile Visits",
      5: "WA Messages",
      6: "Lead Generated"
    };
  
    this.dashboardService.GetCampaignSummary(this.userId, fdate, tdate).subscribe({
      next: (data) => {
        // Map resultType to human-readable text
        const formattedData = data.map((item: any) => ({
          ...item,
          resultType: resultTypeMap[item.resultType] || "Unknown"  // Assign text or 'Unknown' if missing
        }));
  
        this.dataSource.data = formattedData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.error('Error fetching campaign summary:', error),
    });
  }
  

  applyFilter(): void {
    const clientName = this.clientNameFilter.value?.toLowerCase() || '';
  
    this.dataSource.filterPredicate = (data: any) =>
      !clientName || data.clientName.toLowerCase().includes(clientName);
  
    this.dataSource.filter = Math.random().toString(); // Trigger filter refresh
  }
  

  // **Toggle filter visibility**
  toggleFilter(column: string): void {
    this.activeFilters[column] = !this.activeFilters[column];
  }

  exportToExcel(): void {
    if (!this.fromDate.value || !this.toDate.value) {
      console.error("Date range is missing");
      return;
    }
  
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');
    const fileName = `Campaign_Summary_Report_${fdate}_to_${tdate}.xlsx`;
  
    // Create worksheet and workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Add title row with merged cells
    const title = [`Campaign Summary Report (${fdate} to ${tdate})`];
    XLSX.utils.sheet_add_aoa(ws, [title], { origin: 'A1' });
  
    // Add headers and data
    XLSX.utils.sheet_add_json(ws, this.dataSource.data, { origin: 'A3', skipHeader: false });
  
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Campaign Summary');
  
    // Export file
    XLSX.writeFile(wb, fileName);
  }
  
}
