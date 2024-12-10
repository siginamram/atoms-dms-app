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
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MeetmanagementlistComponent } from './components/meet-management-list/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/meet-management-add/meetmanagementadd.component';
import { SlaGenerationAddComponent } from './components/sla-generation-add/sla-generation-add.component';
import { SlaGenerationsListComponent } from './components/sla-generations-list/sla-generations-list.component';
import { QuoteGenerationDocComponent } from './components/quote-generation-doc/quote-generation-doc.component';
import { FormsModule } from '@angular/forms'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SalesConvertedListComponent } from './components/sales-converted-list/sales-converted-list.component';
import { MeetManagementPopupComponent } from './components/meet-management-popup/meet-management-popup.component';
import { SalesConvertStatuEditComponent } from './components/sales-convert-statu-edit/sales-convert-statu-edit.component';

@NgModule({
  declarations: [
    MarketingComponent,
    LeadManagementListComponent, 
    LeadmanagementaddComponent,  
    MeetmanagementlistComponent,
    MeetmanagementaddComponent,
    SlaGenerationAddComponent,
    SlaGenerationsListComponent,
    QuoteGenerationDocComponent,
    SalesConvertedListComponent,
    MeetManagementPopupComponent,
    SalesConvertStatuEditComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MarketingRoutingModule,      
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule, 
    MatCheckboxModule, 
    FormsModule,
           
  ],
})
export class MarketingModule { }
