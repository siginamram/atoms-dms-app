import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { HomeComponent } from './components/home/home/home.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Import Angular Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';

// Animation module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeadmanagementaddComponent } from './components/marketing/leadmanagementadd/leadmanagementadd.component';
import { MeetmanagementlistComponent } from './components/marketing/meetmanagementlist/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/marketing/meetmanagementadd/meetmanagementadd.component';
import { LeadmanagementlistComponent } from './components/marketing/leadmanagementlist/leadmanagementlist.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesListComponent,
    HomeComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    HeaderComponent,
    LeftMenuComponent,
    FooterComponent,
    UserloginComponent,
    DashboardComponent,
    LeadmanagementlistComponent,
    LeadmanagementaddComponent,
    MeetmanagementlistComponent,
    MeetmanagementaddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // Import Material modules here
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    BrowserAnimationsModule,  // Essential for Material Design animations
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatOptionModule,
    NgIf, NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    provideAnimationsAsync(), // Ensure async animations support
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
