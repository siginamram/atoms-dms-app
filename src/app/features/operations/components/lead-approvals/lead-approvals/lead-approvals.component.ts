import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-approvals',
 standalone:false,
  templateUrl: './lead-approvals.component.html',
  styleUrl: './lead-approvals.component.css'
})
export class LeadApprovalsComponent {
  activeTab: string = 'content'; // Default active tab
}
