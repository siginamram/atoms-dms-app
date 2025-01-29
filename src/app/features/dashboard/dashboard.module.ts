import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CwDashboardComponent } from './components/cw-dashboard/cw-dashboard.component';
import { DmaDashboardComponent } from './components/dma-dashboard/dma-dashboard.component';
import { GdDashboardComponent } from './components/gd-dashboard/gd-dashboard.component';
import { LeadDashboardComponent } from './components/lead-dashboard/lead-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { PdDashboardComponent } from './components/pd-dashboard/pd-dashboard.component';
import { PgDashboardComponent } from './components/pg-dashboard/pg-dashboard.component';
import { VeDashboardComponent } from './components/ve-dashboard/ve-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'; // If you want calendar navigation buttons
import { SlDashboardComponent } from './components/sl-dashboard/sl-dashboard.component';
import { SaDashboardComponent } from './components/sa-dashboard/sa-dashboard.component';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientsListComponent } from './components/reports/clients-list/clients-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StatisticsComponent } from './components/reports/statistics/statistics.component';
import { PendingPostsDashboardComponent } from './components/reports/pending-posts-dashboard/pending-posts-dashboard.component';
import { PromotedPostsDashboardComponent } from './components/reports/promoted-posts-dashboard/promoted-posts-dashboard.component';
import { ResourcesListDashboardComponent } from './components/reports/resources-list-dashboard/resources-list-dashboard.component';
import { KtSessionDashboardComponent } from './components/reports/kt-session-dashboard/kt-session-dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    AdminDashboardComponent,
    CwDashboardComponent,
    DmaDashboardComponent,
    GdDashboardComponent,
    LeadDashboardComponent,
    ManagerDashboardComponent,
    PdDashboardComponent,
    PgDashboardComponent,
    VeDashboardComponent,
    SlDashboardComponent,
    SaDashboardComponent,
    ClientsListComponent,
    StatisticsComponent,
    PendingPostsDashboardComponent,
    PromotedPostsDashboardComponent,
    ResourcesListDashboardComponent,
    KtSessionDashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule,     
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
     MatToolbarModule,
     MatPaginatorModule,
     ReactiveFormsModule, 
  
  ]
})
export class DashboardModule {}
