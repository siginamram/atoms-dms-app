import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';
import { LeadManagementListComponent } from './components/lead-management-list/lead-management-list.component';
import { LeadmanagementaddComponent } from './components/lead-management-add/leadmanagementadd.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MeetmanagementlistComponent } from './components/meet-management-list/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/meet-management-add/meetmanagementadd.component';

@NgModule({
  declarations: [
    MarketingComponent,
    LeadManagementListComponent, // Declare LeadManagementListComponent
    LeadmanagementaddComponent,  // Declare LeadmanagementaddComponent
    MeetmanagementlistComponent,
    MeetmanagementaddComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MarketingRoutingModule,      // Import MarketingRoutingModule
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,         // Import ReactiveFormsModule
  ],
})
export class MarketingModule { }
