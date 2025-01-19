import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-approval-history',
  standalone:false,
  templateUrl: './lead-approval-history.component.html',
  styleUrl: './lead-approval-history.component.css'
})
export class LeadApprovalHistoryComponent {
  activeTab: string = 'content'; // Default active tab
}
