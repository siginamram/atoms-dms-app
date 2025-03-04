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
import { DmaOperationsComponent } from './components/dma-operations/dma-operations.component';
import { DmaOperationsEditComponent } from './components/dma-operations-edit/dma-operations-edit.component';
import { PhotoGrapherCompleteHistoryComponent } from './components/photo-grapher-complete-history/photo-grapher-complete-history.component';
import { ContentWritersApprovalComponent } from './components/lead-approvals/content-writers-approval/content-writers-approval.component';
import { LeadApprovalsComponent } from './components/lead-approvals/lead-approvals/lead-approvals.component';
import { GraphicReelsDesignerApprovalComponent } from './components/lead-approvals/graphic-reels-designer-approval/graphic-reels-designer-approval.component';
import { PosterDesignerApprovalComponent } from './components/lead-approvals/poster-designer-approval/poster-designer-approval.component';
import { VideoEditorApprovalComponent } from './components/lead-approvals/video-editor-approval/video-editor-approval.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EditStatusApprovalsComponent } from './components/lead-approvals/edit-status-approvals/edit-status-approvals.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DmaClientsComponent } from './components/dma-clients/dma-clients.component';
import { AdCampaignManagementComponent } from './components/ad-campaign-management/ad-campaign-management.component';
import { AdCampaignTrakerComponent } from './components/ad-campaign-traker/ad-campaign-traker.component';
import { AdCampaignTrakerEditComponent } from './components/ad-campaign-traker-edit/ad-campaign-traker-edit.component';
import { ContentWritersApprovalHistoryComponent } from './components/lead-approvals-history/content-writers-approval-history/content-writers-approval-history.component';
import { GraphicReelsApprovalHistoryComponent } from './components/lead-approvals-history/graphic-reels-approval-history/graphic-reels-approval-history.component';
import { LeadApprovalHistoryComponent } from './components/lead-approvals-history/lead-approval-history/lead-approval-history.component';
import { VideoEditorApprovalHistoryComponent } from './components/lead-approvals-history/video-editor-approval-history/video-editor-approval-history.component';
import { PosterDesignerApprovalHistoryComponent } from './components/lead-approvals-history/poster-designer-approval-history/poster-designer-approval-history.component';
import { KtDocListComponent } from './components/kt-doc-list/kt-doc-list.component';
import { ContentWritersCalendarExportComponent } from './components/content-writers-calendar-export/content-writers-calendar-export.component';
import { AdCampaignReportsComponent } from './components/ad-campaign-reports/ad-campaign-reports.component';
import { AddClientVideosEmergrncyRequestComponent } from './components/add-client-videos-emergrncy-request/add-client-videos-emergrncy-request.component';
import { ContentWriterVideosClientsComponent } from './components/content-writer-videos-clients/content-writer-videos-clients.component';
import { ContentWriterVideosOperationsComponent } from './components/content-writer-videos-operations/content-writer-videos-operations.component';
import { ContentWriterVideosOperationsEditComponent } from './components/content-writer-videos-operations-edit/content-writer-videos-operations-edit.component';

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
    DmaOperationsComponent,
    DmaOperationsEditComponent,
    PhotoGrapherCompleteHistoryComponent,
    ContentWritersApprovalComponent,
    LeadApprovalsComponent,
    GraphicReelsDesignerApprovalComponent,
    PosterDesignerApprovalComponent,
    VideoEditorApprovalComponent,
    EditStatusApprovalsComponent,
    DmaClientsComponent,
    AdCampaignManagementComponent,
    AdCampaignTrakerComponent,
    AdCampaignTrakerEditComponent,
    ContentWritersApprovalHistoryComponent,
    GraphicReelsApprovalHistoryComponent,
    LeadApprovalHistoryComponent,
    VideoEditorApprovalHistoryComponent,
    PosterDesignerApprovalHistoryComponent,
    KtDocListComponent,
    ContentWritersCalendarExportComponent,
    AdCampaignReportsComponent,
    AddClientVideosEmergrncyRequestComponent,
    ContentWriterVideosClientsComponent,
    ContentWriterVideosOperationsComponent,
    ContentWriterVideosOperationsEditComponent,
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
        MatTabsModule,
        MatProgressBarModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }, // Set your preferred locale
  ],
})
export class OperationsModule { }
