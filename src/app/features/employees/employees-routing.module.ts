import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { QualificationComponent } from './components/qualification/qualification.component';

const routes: Routes = [{ path: '', component: EmployeesComponent },
    { path: 'AddComponent',component: AddEmployeeComponent },
    { path:'Qualification', component: QualificationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
