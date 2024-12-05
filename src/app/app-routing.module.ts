import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { HomeComponent } from './components/home/home/home.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: UserloginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'employees',
        component: EmployeesListComponent
      },
      {
        path: 'employees/add',
        component: AddEmployeeComponent
      },
      {
        path: 'employees/edit/:id',
        component: EditEmployeeComponent
      },
      { 
        path: '', // Default child route for home
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
