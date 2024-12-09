import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { HomeComponent } from './components/home/home/home.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadmanagementlistComponent } from './components/marketing/leadmanagementlist/leadmanagementlist.component';
import { LeadmanagementaddComponent } from './components/marketing/leadmanagementadd/leadmanagementadd.component';
import { MeetmanagementlistComponent } from './components/marketing/meetmanagementlist/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/marketing/meetmanagementadd/meetmanagementadd.component';

const routes: Routes = [
  { path: 'login', component: UserloginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'leadmanagement', component: LeadmanagementlistComponent },
      { path: 'leadmanagement/add', component: LeadmanagementaddComponent },
      { path: 'leadmanagement/edit/:id', component: EditEmployeeComponent },
      { path: 'meetmanagement', component: MeetmanagementlistComponent },
      { path: 'meetmanagement/add', component: MeetmanagementaddComponent },
      { path: 'meetmanagement/edit/:id', component: EditEmployeeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
