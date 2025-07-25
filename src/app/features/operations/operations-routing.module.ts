import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsComponent } from './operations.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientsOnboardingComponent } from './components/clients-onboarding/clients-onboarding.component';
import { ClientsPresentEditComponent } from './components/clients-present-edit/clients-present-edit.component';
import { OperationsContentWritersComponent } from './components/operations-content-writers/operations-content-writers.component';
import { ContentWritersClientsComponent } from './components/content-writers-clients/content-writers-clients.component';
import { PosterDesignerClientsComponent } from './components/poster-designer-clients/poster-designer-clients.component';
import { PosterDesignerOperationsComponent } from './components/poster-designer-operations/poster-designer-operations.component';
import { VideoEditorClientsComponent } from './components/video-editor-clients/video-editor-clients.component';
import { VideoEditorOperationsComponent } from './components/video-editor-operations/video-editor-operations.component';
import { SpecialdaysClientsViewComponent } from './components/specialdays-clients-view/specialdays-clients-view.component';
import { SpecialdaysClientsAddComponent } from './components/specialdays-clients-add/specialdays-clients-add.component';
import { AddClientEmergencyRequestComponent } from './components/add-client-emergency-request/add-client-emergency-request.component';
import { GraphicReelDesignerClientComponent } from './components/graphic-reel-designer-client/graphic-reel-designer-client.component';
import { GraphicReelDesignerOperationsComponent } from './components/graphic-reel-designer-operations/graphic-reel-designer-operations.component';
import { PhotoGrapherScheduleMeetComponent } from './components/photo-grapher-schedule-meet/photo-grapher-schedule-meet.component';
import { DmaOperationsComponent } from './components/dma-operations/dma-operations.component';
import { PhotoGrapherCompleteHistoryComponent } from './components/photo-grapher-complete-history/photo-grapher-complete-history.component';
import { LeadApprovalsComponent } from './components/lead-approvals/lead-approvals/lead-approvals.component';
import { DmaClientsComponent } from './components/dma-clients/dma-clients.component';
import { AdCampaignManagementComponent } from './components/ad-campaign-management/ad-campaign-management.component';
import { AdCampaignTrakerComponent } from './components/ad-campaign-traker/ad-campaign-traker.component';
import { LeadApprovalHistoryComponent } from './components/lead-approvals-history/lead-approval-history/lead-approval-history.component';
import { KtDocListComponent } from './components/kt-doc-list/kt-doc-list.component';
import { ContentWritersCalendarExportComponent } from './components/content-writers-calendar-export/content-writers-calendar-export.component';
import { AdCampaignReportsComponent } from './components/ad-campaign-reports/ad-campaign-reports.component';
import { ContentWriterVideosClientsComponent } from './components/content-writer-videos-clients/content-writer-videos-clients.component';
import { ContentWriterVideosOperationsComponent } from './components/content-writer-videos-operations/content-writer-videos-operations.component';
import { ClientMetaDataComponent } from './components/client-meta-data/client-meta-data.component';
import { AdditionalTaskViewComponent } from './components/additional-task-view/additional-task-view.component';
import { AdditionalTaskAddComponent } from './components/additional-task-add/additional-task-add.component';
import { PhotoGrapherClientComponent } from './components/photo-grapher-client/photo-grapher-client.component';
import { PhotoGrapherOperationsComponent } from './components/photo-grapher-operations/photo-grapher-operations.component';
import { ClientVideosEmergrncyRequestComponent } from './components/client-videos-emergrncy-request/client-videos-emergrncy-request.component';
import { AdditionalTaskClientsComponent } from './components/additional-task-clients/additional-task-clients.component';
import { LeadApprovalComponent } from './components/lead-approvals/addition-task/lead-approval/lead-approval.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsComponent, // Parent container
    children: [
           //Clients
      { path: 'clients-list', component: ClientsComponent }, // Child route
      { path: 'clients-onboards/:id', component: ClientsOnboardingComponent },
      { path: 'clients-present/:id', component: ClientsPresentEditComponent },
      { path: 'client-kt-documents', component: KtDocListComponent },

      { path: 'operations-content-writer', component: OperationsContentWritersComponent },
      { path: 'content-writer-client', component: ContentWritersClientsComponent },
      { path: 'content-writer-calender-export', component: ContentWritersCalendarExportComponent },

      { path: 'operations-poster-designer', component: PosterDesignerOperationsComponent },
      { path: 'poster-designer-client', component: PosterDesignerClientsComponent },

      { path: 'operations-video-editor', component: VideoEditorOperationsComponent },
      { path: 'video-editor-client', component: VideoEditorClientsComponent },

      { path: 'photo-grapher-client', component: PhotoGrapherScheduleMeetComponent },
      { path: 'photo-grapher-history', component: PhotoGrapherCompleteHistoryComponent },
      { path: 'operations-photo-grapher', component: PhotoGrapherOperationsComponent },
      { path: 'video-grapher-client', component: PhotoGrapherClientComponent },

      { path: 'content-writer-videos-client', component: ContentWriterVideosClientsComponent },
      { path: 'operations-videos-content-writer', component: ContentWriterVideosOperationsComponent },

      { path: 'specialdays-view', component: SpecialdaysClientsViewComponent },
      { path: 'specialdays-add', component: SpecialdaysClientsAddComponent },
      { path: 'emergency-request-add', component: AddClientEmergencyRequestComponent },

      { path: 'operations-graphicreels-designer', component: GraphicReelDesignerOperationsComponent },
      { path: 'graphicreels-designer-client', component: GraphicReelDesignerClientComponent },

      { path: 'operations-dma', component: DmaOperationsComponent },
      { path: 'client-dma', component: DmaClientsComponent },
      { path: 'ad-campaign-dma', component: AdCampaignManagementComponent },
      { path: 'ad-campaign-operations-dma', component: AdCampaignTrakerComponent },
      { path:'ad-campaign-report', component:AdCampaignReportsComponent},

      { path: 'lead-approvals', component: LeadApprovalsComponent },
      { path: 'lead-approvals-history', component: LeadApprovalHistoryComponent },

      { path: 'clientMeta-view', component: ClientMetaDataComponent },
      
      {path: 'additional-task-view', component: AdditionalTaskViewComponent},
      {path: 'additional-task-add', component: AdditionalTaskAddComponent},
      {path: 'additional-task-Clients', component: AdditionalTaskClientsComponent},  
      {path: 'additional-task-Appoval', component: LeadApprovalComponent}, 

      { path: 'video-emergency-request', component: ClientVideosEmergrncyRequestComponent },

  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
