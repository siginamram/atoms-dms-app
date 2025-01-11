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
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'; // If you want calendar navigation buttons
import { SlDashboardComponent } from './components/sl-dashboard/sl-dashboard.component';
import { SaDashboardComponent } from './components/sa-dashboard/sa-dashboard.component';
import { MatIconModule } from '@angular/material/icon';



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
  
  ]
})
export class DashboardModule {}
