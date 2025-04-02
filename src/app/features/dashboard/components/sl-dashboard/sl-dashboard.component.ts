import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sl-dashboard',
  standalone: false,
  templateUrl: './sl-dashboard.component.html',
  styleUrls: ['./sl-dashboard.component.css']
})
export class SlDashboardComponent implements OnInit {
  fromDateValue: Date = new Date(moment().startOf('month').format('YYYY-MM-DD'));
  toDateValue: Date = new Date(moment().endOf('month').format('YYYY-MM-DD'));

  displayedColumns = ['sno', 'name', 'prospectsRegistered', 'dealsClosed', 'revenueGenerated', 'successRate'];
  kpis: any[] = [];
  tableData: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  applyDateFilter(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    const userId = +localStorage.getItem('UserID')!; 
    const fdate = moment(this.fromDateValue).format('YYYY-MM-DD');
    const tdate = moment(this.toDateValue).format('YYYY-MM-DD');

    this.dashboardService.GetDashboardSalesLeadByUser(userId, fdate, tdate).subscribe((res: any) => {
      const sales = res.salesMonthlydashboard;

      this.kpis = [
        { title: 'No.of Sales Associates', value: sales.totalSalesAssociates, icon: 'group', color: '#4CAF50' },
        { title: 'No.of Prospects Registered', value: sales.totalProspects, icon: 'assignment', color: '#2196F3' },
        { title: 'No.of Meetings Scheduled', value: sales.meetingsScheduled, icon: 'schedule', color: '#FFC107' },
        { title: 'No.of Meetings Completed', value: sales.meetingsCompleted, icon: 'done_all', color: '#8BC34A' },
        { title: 'No.of Upcoming Meetings', value: sales.upcomingMeetings, icon: 'event', color: '#FF9800' },
        { title: 'No.of Rejected Prospects', value: sales.rejectedProspects, icon: 'cancel', color: '#F44336' },
        { title: 'No.of Deals Closed', value: sales.dealsClosed, icon: 'monetization_on', color: '#9C27B0' },
        { title: 'Team Success Rate', value: sales.teamSuccessRate, icon: 'trending_up', color: '#00BCD4' },
        { title: 'Revenue Generated', value: sales.revenueGenerated, icon: 'attach_money', color: '#673AB7' }
      ];

      this.tableData = res.salesleaddashboard.map((item: any) => ({
        name: item.name,
        prospectsRegistered: item.prospectsRegistered,
        dealsClosed: item.dealsClosed,
        revenueGenerated: item.revenueGenerated,
        successRate: item.successRate
      }));
    });
  }
}
