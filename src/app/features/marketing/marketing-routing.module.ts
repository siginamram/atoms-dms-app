import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingComponent } from './marketing.component';
import { LeadManagementListComponent } from './components/lead-management-list/lead-management-list.component';
import { LeadmanagementaddComponent } from './components/lead-management-add/leadmanagementadd.component';
import { MeetmanagementlistComponent } from './components/meet-management-list/meetmanagementlist.component';
import { MeetmanagementaddComponent } from './components/meet-management-add/meetmanagementadd.component';
import { SlaGenerationsListComponent } from './components/sla-generations-list/sla-generations-list.component';
import { SlaGenerationAddComponent } from './components/sla-generation-add/sla-generation-add.component';
import { QuoteGenerationDocComponent } from './components/quote-generation-doc/quote-generation-doc.component';
import { QuoteGenerationAddComponent } from './components/quote-generation-add/quote-generation-add.component';
import { SalesConvertedListComponent } from './components/sales-converted-list/sales-converted-list.component';
import { MeetManagementPopupComponent } from './components/meet-management-popup/meet-management-popup.component';
import { SalesConvertStatuEditComponent } from './components/sales-convert-statu-edit/sales-convert-statu-edit.component';
import { LeadManagementEditComponent } from './components/lead-management-edit/lead-management-edit.component';
import { SlaGenerationDynamicComponent } from './components/sla-generation-dynmic/sla-generation-dynmic.component';
import { MeetManagementHistoryComponent } from './components/meet-management-history/meet-management-history.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingComponent, // Parent container
    children: [
           //Lead
      { path: 'lead-management', component: LeadManagementListComponent }, // Child route
      { path: 'add-lead', component: LeadmanagementaddComponent },
      { path: 'edit-lead', component: LeadManagementEditComponent },
           //Meet
      { path: 'meet-management', component: MeetmanagementlistComponent },
      { path: 'add-meet/:id', component: MeetmanagementaddComponent },
      { path:'meet-popup',component:MeetManagementPopupComponent},
      { path:'meet-popup/:id',component:MeetManagementPopupComponent},
      { path: 'meet-management-histoty', component: MeetManagementHistoryComponent },
         //Quote
      { path:'generate-quote',component:QuoteGenerationDocComponent},
      { path:'generate-new-quote/:id',component:QuoteGenerationAddComponent},
        //SLA
      { path:'sla-generation',component:SlaGenerationsListComponent},
      { path:'generate-sla/:id',component:SlaGenerationAddComponent},
      { path:'sla-generation/:id',component:SlaGenerationDynamicComponent},
      { path:'sales-converted',component:SalesConvertedListComponent},
      { path:'sales-convert-status-edit',component:SalesConvertStatuEditComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
