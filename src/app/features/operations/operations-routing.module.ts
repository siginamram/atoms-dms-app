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

const routes: Routes = [
  {
    path: '',
    component: OperationsComponent, // Parent container
    children: [
           //Clients
      { path: 'clients-list', component: ClientsComponent }, // Child route
      { path: 'clients-onboards/:id', component: ClientsOnboardingComponent },
      { path: 'clients-present/:id', component: ClientsPresentEditComponent },

      { path: 'operations-content-writer', component: OperationsContentWritersComponent },
      { path: 'content-writer-client', component: ContentWritersClientsComponent },

      { path: 'operations-poster-designer', component: PosterDesignerOperationsComponent },
      { path: 'poster-designer-client', component: PosterDesignerClientsComponent },

      { path: 'operations-video-editor', component: VideoEditorOperationsComponent },
      { path: 'video-editor-client', component: VideoEditorClientsComponent },

      { path: 'photo-grapher-client', component: PhotoGrapherScheduleMeetComponent },
      { path: 'photo-grapher-history', component: PhotoGrapherCompleteHistoryComponent },

      { path: 'specialdays-view', component: SpecialdaysClientsViewComponent },
      { path: 'specialdays-add', component: SpecialdaysClientsAddComponent },
      { path: 'emergency-request-add', component: AddClientEmergencyRequestComponent },

      { path: 'operations-graphicreels-designer', component: GraphicReelDesignerOperationsComponent },
      { path: 'graphicreels-designer-client', component: GraphicReelDesignerClientComponent },

      { path: 'operations-dma', component: DmaOperationsComponent },
      { path: 'lead-approvals', component: LeadApprovalsComponent },
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
