import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manager-dashboard',
  standalone:false,
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent {
  displayedColumns: string[] = ['member', 'role', 'toApprove', 'approved', 'manager'];

  deliverablesColumns: string[] = ['name', 'toBePromoted', 'promoted', 'pending'];

   // Sample data for deliverables and approval status
   deliverables = [
    { name: 'Posters', toBePromoted: 35, promoted: 30, pending: 5, date: new Date(2023, 5, 10) },
    { name: 'Graphic Reel', toBePromoted: 15, promoted: 14, pending: 1, date: new Date(2023, 6, 15) },
    { name: 'Educational Reels', toBePromoted: 8, promoted: 6, pending: 2, date: new Date(2023, 6, 5) },
    { name: 'YouTube Videos', toBePromoted: 6, promoted: 5, pending: 1, date: new Date(2023, 5, 20) },
  ];

  approvalStatus = [
    { member: 'Pavani', role: 'Content Writer', toApprove: 32, approved: 30, manager: 'Durgesh' },
    { member: 'Renukeswara Rao', role: 'Content Writer', toApprove: 25, approved: 14, manager: 'Durgesh' },
    { member: 'Manikanta', role: 'Poster Designer', toApprove: 14, approved: 6, manager: 'Manjunadha' },
    { member: 'Dariya', role: 'Video Editor', toApprove: 8, approved: 5, manager: 'Anvesh' },
  ];
 // Date Filter Bindings
 fromDateValue: Date | null = null;
 toDateValue: Date | null = null;

 filteredDeliverables = new MatTableDataSource(this.deliverables);
 filteredApprovalStatus = new MatTableDataSource(this.approvalStatus);

 // Method to apply date filter
 applyDateFilter(): void {
   const fromDate = this.fromDateValue;
   const toDate = this.toDateValue;

   // Filter deliverables based on the selected date range
   this.filteredDeliverables.data = this.deliverables.filter(item => {
     return (!fromDate || item.date >= fromDate) && (!toDate || item.date <= toDate);
   });

   // Filter approval status based on the selected date range (if applicable)
   this.filteredApprovalStatus.data = this.approvalStatus; // Assuming approval status does not require date filtering
 }
  dataStats = [
    { label: 'Number of Clients', value: 40 },
    { label: 'K.T Sessions', value: 10 },
    { label: 'Shoot Status', value: 5 },
    { label: 'Content Writer', value: 3 },
    { label: 'Poster Designer', value: 5 },
    { label: 'Video Editor', value: 4 },
    { label: 'D.M.A', value: 5 },
    { label: 'Statistics', value: 2 },
  ];

  getStatIcon(label: string): string {
    switch (label) {
      case 'Number of Clients':
        return 'group';
      case 'K.T Sessions':
        return 'event';
      case 'Shoot Status':
        return 'camera_alt';
      case 'Content Writer':
        return 'create';
      case 'Poster Designer':
        return 'brush';
      case 'Video Editor':
        return 'movie';
      case 'D.M.A':
        return 'settings';
      case 'Statistics':
        return 'bar_chart';
      default:
        return 'info';
    }
  }

  getStatColor(label: string): string {
    switch (label) {
      case 'Number of Clients':
        return '#4caf50'; // Green
      case 'K.T Sessions':
        return '#ff9800'; // Orange
      case 'Shoot Status':
        return '#2196f3'; // Blue
      case 'Content Writer':
        return '#3f51b5'; // Indigo
      case 'Poster Designer':
        return '#9c27b0'; // Purple
      case 'Video Editor':
        return '#f44336'; // Red
      case 'D.M.A':
        return '#00bcd4'; // Cyan
      case 'Statistics':
        return '#795548'; // Brown
      default:
        return '#607d8b'; // Default Gray
    }
  }
}
