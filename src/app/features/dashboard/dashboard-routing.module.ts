import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { LeadDashboardComponent } from './components/lead-dashboard/lead-dashboard.component';
import { CwDashboardComponent } from './components/cw-dashboard/cw-dashboard.component';
import { SlDashboardComponent } from './components/sl-dashboard/sl-dashboard.component';
import { SaDashboardComponent } from './components/sa-dashboard/sa-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent }, // Default child route
      { path: 'home-dashboard', component: DashboardHomeComponent }, // Explicit route for home if needed
      { path: 'manager-dashboard', component: ManagerDashboardComponent },
      { path: 'lead-dashboard', component: LeadDashboardComponent },
      { path: 'cw-dashboard', component: CwDashboardComponent },
      { path: 'sl-dashboard', component: SlDashboardComponent },
      { path: 'sa-dashboard', component: SaDashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
