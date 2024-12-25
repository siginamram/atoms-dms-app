import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { FormsModule } from '@angular/forms'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
//import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientsOnboardingComponent } from './components/clients-onboarding/clients-onboarding.component';
import { ClientsPresentEditComponent } from './components/clients-present-edit/clients-present-edit.component';
import { OperationsContentWritersComponent } from './components/operations-content-writers/operations-content-writers.component';
import { ContentWritersClientsComponent } from './components/content-writers-clients/content-writers-clients.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    OperationsComponent,
    ClientsComponent,
    ClientsOnboardingComponent,
    ClientsPresentEditComponent,
    OperationsContentWritersComponent,
    ContentWritersClientsComponent,
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
        MatDatepickerModule,
        MatNativeDateModule,
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
        //NgxMaterialTimepickerModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Set your preferred locale
  ],
})
export class OperationsModule { }
