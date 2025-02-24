import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { QualificationComponent } from './components/qualification/qualification.component';
import { HolidaysCalendarComponent } from './components/leave-management/holidays-calendar/holidays-calendar.component';
import { EmployeeLeaveApplicationComponent } from './components/leave-management/employee-leave-application/employee-leave-application.component';
import { ApproveLeavesComponent } from './components/leave-management/approve-leaves/approve-leaves.component';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { EmloyeepEducationdetailsComponent } from './components/emloyeep-educationdetails/emloyeep-educationdetails.component';

// const routes: Routes = [{ path: '', component: EmployeesComponent },
//     { path: 'AddComponent',component: AddEmployeeComponent },
//     { path:'Qualification', component: QualificationComponent}
// ];
const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent, // Parent container
    children: [
      { path: 'AddComponent',component: AddEmployeeComponent },
      { path: 'listofemployees',component: EmployeesListComponent },
      { path:'Qualification', component: QualificationComponent},
      { path:'holidays-calendar', component: HolidaysCalendarComponent},
      { path:'leave-applications', component: EmployeeLeaveApplicationComponent},
      { path:'leave-approvals', component: ApproveLeavesComponent},
      { path:'employee-dashboard', component: EmployeeDashboardComponent},
      { path:'employee-education', component: EmloyeepEducationdetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
