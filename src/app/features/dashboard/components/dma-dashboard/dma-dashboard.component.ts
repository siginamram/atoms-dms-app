import { Component } from '@angular/core';

@Component({
  selector: 'app-dma-dashboard',
  standalone:false,
  templateUrl: './dma-dashboard.component.html',
  styleUrl: './dma-dashboard.component.css'
})
export class DmaDashboardComponent {
  filter = { fromDate: '', toDate: '' };

  metrics = {
    numberOfClients: 20,
    postsPromoted: 25,
    pendingPosts: 25,
    pendingApprovals: 120,
    adCampaignsUpdated: 25,
    adCampaignsToBeUpdated: 25,
    budgetToBeSpent: 50000,
    budgetSpent: 40000,
    adReach: 10000000,
    impressions: 30000000,
    profileVisits: 50000,
    followers: 5000,
    messages: 500,
    leads: 500,
  };

  clientData = [
    {
      clientName: 'Client A',
      postersPromoted: 10,
      gReelsPromoted: 5,
      edReelsPromoted: 3,
      youtubeVideosPromoted: 2,
    },
    {
      clientName: 'Client B',
      postersPromoted: 8,
      gReelsPromoted: 4,
      edReelsPromoted: 2,
      youtubeVideosPromoted: 3,
    },
  ];

  displayedColumns = [
    'clientName',
    'postersPromoted',
    'gReelsPromoted',
    'edReelsPromoted',
    'youtubeVideosPromoted',
  ];

  applyFilter() {
    console.log('Filters applied:', this.filter);
  }
}
