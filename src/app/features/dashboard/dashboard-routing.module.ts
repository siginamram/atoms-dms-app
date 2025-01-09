import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { LeadDashboardComponent } from './components/lead-dashboard/lead-dashboard.component';
import { CwDashboardComponent } from './components/cw-dashboard/cw-dashboard.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
