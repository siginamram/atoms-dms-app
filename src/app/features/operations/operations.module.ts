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
import { PosterDesignerClientsComponent } from './components/poster-designer-clients/poster-designer-clients.component';
import { PosterDesignerOperationsComponent } from './components/poster-designer-operations/poster-designer-operations.component';
import { VideoEditorClientsComponent } from './components/video-editor-clients/video-editor-clients.component';
import { VideoEditorOperationsComponent } from './components/video-editor-operations/video-editor-operations.component';
import { PhotoGrapherClientsComponent } from './components/photo-grapher-clients/photo-grapher-clients.component';
import { PhotoGrapherOperationsComponent } from './components/photo-grapher-operations/photo-grapher-operations.component';
import { SpecialdaysClientsViewComponent } from './components/specialdays-clients-view/specialdays-clients-view.component';
import { SpecialdaysClientsAddComponent } from './components/specialdays-clients-add/specialdays-clients-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddClientEmergencyRequestComponent } from './components/add-client-emergency-request/add-client-emergency-request.component';
import { ContentWritersOperationsEditComponent } from './components/content-writers-operations-edit/content-writers-operations-edit.component';
import { PosterDesignerOperationsEditComponent } from './components/poster-designer-operations-edit/poster-designer-operations-edit.component';
import { GraphicReelDesignerClientComponent } from './components/graphic-reel-designer-client/graphic-reel-designer-client.component';
import { GraphicReelDesignerOperationsComponent } from './components/graphic-reel-designer-operations/graphic-reel-designer-operations.component';
import { GraphicReelDesignerOperationsEditComponent } from './components/graphic-reel-designer-operations-edit/graphic-reel-designer-operations-edit.component';
import { VideoEditorOperationsEditComponent } from './components/video-editor-operations-edit/video-editor-operations-edit.component';
import { PhotoGrapherScheduleMeetComponent } from './components/photo-grapher-schedule-meet/photo-grapher-schedule-meet.component';
import { PhotoGrapherScheduleMeetPopupComponent } from './components/photo-grapher-schedule-meet-popup/photo-grapher-schedule-meet-popup.component';


const MY_FORMATS = {
  parse: {
      parse: { dateInput: 'DD/MM/YYYY' },
  },
  display: {
   dateInput: 'DD/MM/YYYY' ,
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
    PosterDesignerClientsComponent,
    PosterDesignerOperationsComponent,
    VideoEditorClientsComponent,
    VideoEditorOperationsComponent,
    PhotoGrapherClientsComponent,
    PhotoGrapherOperationsComponent,
    SpecialdaysClientsViewComponent,
    SpecialdaysClientsAddComponent,
    AddClientEmergencyRequestComponent,
    ContentWritersOperationsEditComponent,
    PosterDesignerOperationsEditComponent,
    GraphicReelDesignerClientComponent,
    GraphicReelDesignerOperationsComponent,
    GraphicReelDesignerOperationsEditComponent,
    VideoEditorOperationsEditComponent,
    PhotoGrapherScheduleMeetComponent,
    PhotoGrapherScheduleMeetPopupComponent,
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
        SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Set your preferred locale
  ],
})
export class OperationsModule { }
