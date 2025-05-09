import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { LeadDashboardComponent } from './components/lead-dashboard/lead-dashboard.component';
import { CwDashboardComponent } from './components/cw-dashboard/cw-dashboard.component';
import { SlDashboardComponent } from './components/sl-dashboard/sl-dashboard.component';
import { SaDashboardComponent } from './components/sa-dashboard/sa-dashboard.component';
import { PdDashboardComponent } from './components/pd-dashboard/pd-dashboard.component';
import { ClientsListComponent } from './components/reports/clients-list/clients-list.component';
import { StatisticsComponent } from './components/reports/statistics/statistics.component';
import { PendingPostsDashboardComponent } from './components/reports/pending-posts-dashboard/pending-posts-dashboard.component';
import { PromotedPostsDashboardComponent } from './components/reports/promoted-posts-dashboard/promoted-posts-dashboard.component';
import { ResourcesListDashboardComponent } from './components/reports/resources-list-dashboard/resources-list-dashboard.component';
import { KtSessionDashboardComponent } from './components/reports/kt-session-dashboard/kt-session-dashboard.component';
import { DmaDashboardComponent } from './components/dma-dashboard/dma-dashboard.component';
import { PgDashboardComponent } from './components/pg-dashboard/pg-dashboard.component';
import { VideoEditerDashboardComponent } from './components/reports/video-editer-dashboard/video-editer-dashboard.component';
import { ClientDashboardComponent } from './components/reports/client-dashboard/client-dashboard.component';
import { DmaPendingPostsDashboardComponent } from './components/reports/dma-pending-posts-dashboard/dma-pending-posts-dashboard.component';
import { DmaPromotedPostsDashboardComponent } from './components/reports/dma-promoted-posts-dashboard/dma-promoted-posts-dashboard.component';
import { AdcampaignsummaryReportComponent } from './components/reports/adcampaignsummary-report/adcampaignsummary-report.component';
import { PostersPendingComponent } from './components/reports/posters-pending/posters-pending.component';
import { ContentVediosPendingDeliverablesComponent } from './components/reports/content-vedios-pending-deliverables/content-vedios-pending-deliverables.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent }, 
      { path: 'home-dashboard', component: DashboardHomeComponent }, 
      { path: 'manager-dashboard', component: ManagerDashboardComponent },
      { path: 'lead-dashboard', component: LeadDashboardComponent },
      { path: 'pd-dashboard', component: PdDashboardComponent },
      { path: 'cw-dashboard', component: CwDashboardComponent },
      { path: 'sl-dashboard', component: SlDashboardComponent },
      { path: 'sa-dashboard', component: SaDashboardComponent },
      { path: 'clients-list', component: ClientsListComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'pending-posts', component: PendingPostsDashboardComponent },
      { path: 'promoted-posts', component: PromotedPostsDashboardComponent },
      { path: 'resource-list', component: ResourcesListDashboardComponent },
      { path: 'kt-sessions', component: KtSessionDashboardComponent },
      { path: 'dma-dashboard', component: DmaDashboardComponent },
      { path: 'pg-dashboard', component: PgDashboardComponent },
      { path: 'video-editor-dashboard', component: VideoEditerDashboardComponent },
      { path: 'client-dashboard', component: ClientDashboardComponent },
      { path: 'dma-pending-posts', component: DmaPendingPostsDashboardComponent },
      { path: 'dma-promoted-posts', component: DmaPromotedPostsDashboardComponent },
      { path: 'dma-adcampaign-summary', component: AdcampaignsummaryReportComponent },
      { path: 'posts-pending', component: PostersPendingComponent },
      { path: 'content-vedios-pending-posts', component: ContentVediosPendingDeliverablesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
