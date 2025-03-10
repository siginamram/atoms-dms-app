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
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
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
import { LeadManagementEditComponent } from './components/lead-management-edit/lead-management-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SlaGenerationDynamicComponent } from './components/sla-generation-dynmic/sla-generation-dynmic.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MeetManagementHistoryComponent } from './components/meet-management-history/meet-management-history.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { QuoteGenerationAddComponent } from './components/quote-generation-add/quote-generation-add.component';
import { MatRadioModule } from '@angular/material/radio';
import { QuoteGenerationDownloadComponent } from './components/quote-generation-download/quote-generation-download.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY' ,
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    LeadManagementEditComponent,
    SlaGenerationDynamicComponent,
    MeetManagementHistoryComponent,
    QuoteGenerationAddComponent,
    QuoteGenerationDownloadComponent,

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
    MatDialogModule,
    MatPaginatorModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatRadioModule,

  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
  ]
})
export class MarketingModule { }
