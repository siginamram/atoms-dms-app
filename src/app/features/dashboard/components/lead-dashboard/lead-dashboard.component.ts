import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-lead-dashboard',
  standalone:false,
  templateUrl: './lead-dashboard.component.html',
  styleUrl: './lead-dashboard.component.css'
})
export class LeadDashboardComponent implements OnInit {
  deliverablesColumns: string[] = [
    'name',
    'noOfPendingPosts',
    'noOfPromotedPosts',
    'noOfOnTimePosts',
    'noOfEarlyPosts',
    'noOfLatePosts',
  ];

  displayedColumns: string[] = [
    'empName',
    'roleName',
    'sentForApprovalCount',
    'approvedCount',
    'pendingApprovalCount',
    'changesRecommenedCount',
    'manager',
  ];

  fromDateValue: Date | null = null;
  toDateValue: Date | null = null;

  filteredDeliverables = new MatTableDataSource<any>([]);
  filteredApprovalStatus = new MatTableDataSource<any>([]);
  dataStats: any[] = [];
  showSpinner: boolean = false; // Default value
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
     const today = new Date();
     this.toDateValue = today;
     this.fromDateValue = today;
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.showSpinner = true;
    const userId = +localStorage.getItem('UserID')!; 
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);

    this.dashboardService.getManagerDashboardData(userId, fdate, tdate).subscribe(
      (data) => {
        this.showSpinner = false;
        this.updateDeliverables(data.deliverableStatus);
        this.updateApprovalStatus(data.approvalStatus);
        this.updateDataStats(data);
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  applyDateFilter(): void {
    this.fetchDashboardData();
  }

  updateDeliverables(deliverableStatus: any[]): void {
    this.filteredDeliverables.data = deliverableStatus.map((item) => ({
      name: item.creativeTypeName,
      noOfPendingPosts: item.noOfPendingPosts,
      noOfPromotedPosts: item.noOfPromotedPosts,
      noOfOnTimePosts: item.noOfOnTimePosts,
      noOfEarlyPosts: item.noOfEarlyPosts,
      noOfLatePosts: item.noOfLatePosts,
    }));
  }

  updateApprovalStatus(approvalStatus: any[]): void {
    this.filteredApprovalStatus.data = approvalStatus.map((item) => ({
      empName: item.empName,
      roleName: item.roleName,
      sentForApprovalCount: item.sentForApprovalCount,
      approvedCount: item.approvedCount,
      pendingApprovalCount: item.pendingApprovalCount,
      changesRecommenedCount: item.changesRecommenedCount,
      manager: item.manager || 'N/A',
    }));
  }

  updateDataStats(data: any): void {
    const userCounts = data.usersCount.map((user:any) => ({
      label: user.roleName,
      value: user.noOfUsers,
    }));

    this.dataStats = [
      { label: 'Number of Clients', value: data.clientSCount.clientCount },
      { label: 'K.T Sessions', value: data.clientSCount.ktPendingCount },
      ...userCounts,
      { label: 'Statistics', value:'' },
    ];
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getStatIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Number of Clients': 'group',
      'K.T Sessions':'event',
      'Content Writer': 'create',
      'Poster Designer': 'brush',
      'Video Editor': 'movie',
      'DMA': 'settings',
      'Videographer': 'videocam',
      'Statistics':'bar_chart',
    };
    return icons[label] || 'info';
  }

  getStatColor(label: string): string {
    const colors: { [key: string]: string } = {
      'Number of Clients': '#4caf50',
      'K.T Sessions':'#ff9800',
      'Content Writer': '#3f51b5',
      'Poster Designer': '#9c27b0',
      'Video Editor': '#f44336',
      'DMA': '#00bcd4',
      'Videographer': '#00bcd4',
      'Statistics':'#795548',
    };
    return colors[label] || '#607d8b';
  }

  editRow(lead: any): void {
  console.log(lead);
   // this.router.navigate(['/home/operations/operations-content-writer'], {
     // queryParams: {date:this.selectedDate,clientId:lead.clientId },
    //});
} 
getRow(lead: any): void {
  console.log(lead);
   // this.router.navigate(['/home/operations/operations-content-writer'], {
     // queryParams: {date:this.selectedDate,clientId:lead.clientId },
    //});
}
}
