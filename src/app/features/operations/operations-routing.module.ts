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
import { PhotoGrapherClientsComponent } from './components/photo-grapher-clients/photo-grapher-clients.component';
import { PhotoGrapherOperationsComponent } from './components/photo-grapher-operations/photo-grapher-operations.component';
import { SpecialdaysClientsViewComponent } from './components/specialdays-clients-view/specialdays-clients-view.component';
import { SpecialdaysClientsAddComponent } from './components/specialdays-clients-add/specialdays-clients-add.component';


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

      { path: 'operations-photo-grapher', component: PhotoGrapherOperationsComponent },
      { path: 'photo-grapher-client', component: PhotoGrapherClientsComponent },

      { path: 'specialdays-view', component: SpecialdaysClientsViewComponent },
      { path: 'specialdays-add', component: SpecialdaysClientsAddComponent },

  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
