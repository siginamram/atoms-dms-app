import { Component } from '@angular/core';

@Component({
  selector: 'app-pg-dashboard',
  standalone:false,
  templateUrl: './pg-dashboard.component.html',
  styleUrl: './pg-dashboard.component.css'
})
export class PgDashboardComponent {
  filter = {
    fromDate: '',
    toDate: '',
  };

  data = [
    { client: 'ssssssss', tentativeShootDate: '2025-02-10', scheduledDate: '2025-02-12', noOfReelsRequired: 10, noOfReelsShoot: 8, noOfYoutubeVideosRequired: 3, noOfYoutubeVideosShoot: 2 },
    { client: 'PPPPPP', tentativeShootDate: '2025-02-15', scheduledDate: '2025-02-17', noOfReelsRequired: 5, noOfReelsShoot: 4, noOfYoutubeVideosRequired: 2, noOfYoutubeVideosShoot: 1 },
    { client: 'ssssss', tentativeShootDate: '2025-02-20', scheduledDate: '2025-02-22', noOfReelsRequired: 8, noOfReelsShoot: 7, noOfYoutubeVideosRequired: 4, noOfYoutubeVideosShoot: 3 },
  ];

  displayedColumns: string[] = [
    'client',
    'tentativeShootDate',
    'scheduledDate',
    'noOfReelsRequired',
    'noOfReelsShoot',
    'noOfYoutubeVideosRequired',
    'noOfYoutubeVideosShoot',
  ];

  filteredData = [...this.data];

  // Calculated metrics
  get totalShootsRequired(): number {
    return this.data.reduce((sum, entry) => sum + entry.noOfReelsRequired, 0);
  }

  get totalShootsCompleted(): number {
    return this.data.reduce((sum, entry) => sum + entry.noOfReelsShoot, 0);
  }

  get totalVideosRequired(): number {
    return this.data.reduce((sum, entry) => sum + entry.noOfYoutubeVideosRequired, 0);
  }

  applyFilter() {
    const from = this.filter.fromDate ? new Date(this.filter.fromDate).getTime() : null;
    const to = this.filter.toDate ? new Date(this.filter.toDate).getTime() : null;

    this.filteredData = this.data.filter((entry) => {
      const date = new Date(entry.tentativeShootDate).getTime();
      return (!from || date >= from) && (!to || date <= to);
    });
  }
}