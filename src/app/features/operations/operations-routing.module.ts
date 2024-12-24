import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsComponent } from './operations.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientsOnboardingComponent } from './components/clients-onboarding/clients-onboarding.component';
import { ClientsPresentEditComponent } from './components/clients-present-edit/clients-present-edit.component';
import { OperationsContentWritersComponent } from './components/operations-content-writers/operations-content-writers.component';
import { ContentWritersClientsComponent } from './components/content-writers-clients/content-writers-clients.component';

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
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
