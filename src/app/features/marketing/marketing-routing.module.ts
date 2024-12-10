import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingComponent } from './marketing.component';
import { LeadManagementListComponent } from './components/lead-management-list/lead-management-list.component';
import { LeadmanagementaddComponent } from './components/lead-management-add/leadmanagementadd.component';
import { MeetmanagementlistComponent } from './components/meet-management-list/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/meet-management-add/meetmanagementadd.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingComponent, // Parent container
    children: [
      { path: 'lead-management', component: LeadManagementListComponent }, // Child route
      { path: 'add-lead', component: LeadmanagementaddComponent },
      { path: 'meet-management', component: MeetmanagementlistComponent },
      { path: 'add-meet', component: MeetmanagementaddComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
