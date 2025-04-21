import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { QualificationComponent } from './components/qualification/qualification.component';
import { MatIconModule } from '@angular/material/icon';
import { HolidaysCalendarComponent } from './components/leave-management/holidays-calendar/holidays-calendar.component';
import { EmployeeLeaveApplicationComponent } from './components/leave-management/employee-leave-application/employee-leave-application.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LeaveApplyComponent } from './components/leave-management/leave-apply/leave-apply.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ApproveLeavesComponent } from './components/leave-management/approve-leaves/approve-leaves.component';
import { ApproveLeavesEditComponent } from './components/leave-management/approve-leaves-edit/approve-leaves-edit.component';
import { LateCommingApplyComponent } from './components/leave-management/late-comming-apply/late-comming-apply.component';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BasicdetaislAddemployeeComponent } from './components/basicdetaisl-addemployee/basicdetaisl-addemployee.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { LateCommingEditComponent } from './components/leave-management/late-comming-edit/late-comming-edit.component';
import { GstinvoicesComponent } from './components/accounts/gstinvoices/gstinvoices.component';
import { GstinvoicespopupComponent } from './components/accounts/gstinvoicespopup/gstinvoicespopup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonGstinvoicesComponent } from './components/accounts/non-gstinvoices/non-gstinvoices.component';
import { NonGstinvoicespopupComponent } from './components/accounts/non-gstinvoicespopup/non-gstinvoicespopup.component';
import { PaymentCollectionComponent } from './components/accounts/payment-collection/payment-collection.component';
import { AddPaymentCollectionComponent } from './components/accounts/add-payment-collection/add-payment-collection.component';
import { BudgetPlanningComponent } from './components/accounts/budget-planning/budget-planning.component';
import { IncomeStatementComponent } from './components/accounts/income-statement/income-statement.component';
import { AtomsExpensesComponent } from './components/accounts/atoms-expenses/atoms-expenses.component';
import { AddAtomsExpensesComponent } from './components/accounts/add-atoms-expenses/add-atoms-expenses.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { GstinvoicesdownloadComponent } from './components/accounts/gstinvoicesdownload/gstinvoicesdownload.component';
import { NonGstinvoicesdownloadComponent } from './components/accounts/non-gstinvoicesdownload/non-gstinvoicesdownload.component';
import { PaymentsComponent } from './components/accounts/payments/payments.component';
import { EmployeeSalarysComponent } from './components/employee-salarys/employee-salarys.component';
import { EmployeeUpdateSalaryStatusComponent } from './components/employee-update-salary-status/employee-update-salary-status.component';
import { ClientsAdvancePaymentComponent } from './components/accounts/clients-advance-payment/clients-advance-payment.component';
import { EmloyeepEducationdetailsComponent } from './components/emloyeep-educationdetails/emloyeep-educationdetails.component';
import { EmployeeWorkExperienceComponent } from './components/employee-work-experience/employee-work-experience.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmployeeOtherDetailsComponent } from './components/employee-other-details/employee-other-details.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    AddEmployeeComponent,
    QualificationComponent,
    HolidaysCalendarComponent,
    EmployeeLeaveApplicationComponent,
    LeaveApplyComponent,
    ApproveLeavesComponent,
    ApproveLeavesEditComponent,
    LateCommingApplyComponent,
    EmployeesListComponent,
    BasicdetaislAddemployeeComponent,
    EmployeeDashboardComponent,
    LateCommingEditComponent,
    GstinvoicesComponent,
    GstinvoicespopupComponent,
    NonGstinvoicesComponent,
    NonGstinvoicespopupComponent,
    PaymentCollectionComponent,
    AddPaymentCollectionComponent,
    BudgetPlanningComponent,
    IncomeStatementComponent,
    AtomsExpensesComponent,
    AddAtomsExpensesComponent,
    GstinvoicesdownloadComponent,
    NonGstinvoicesdownloadComponent,
    PaymentsComponent,
    EmployeeSalarysComponent,
    EmployeeUpdateSalaryStatusComponent,
    ClientsAdvancePaymentComponent,
    EmloyeepEducationdetailsComponent,
    EmployeeWorkExperienceComponent,
    EmployeeOtherDetailsComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    MatProgressSpinnerModule ,
    MatCheckboxModule,
    MatExpansionModule, 
    MatProgressBarModule,
  ]
})
export class EmployeesModule { }
