import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-approval-history',
  standalone:false,
  templateUrl: './lead-approval-history.component.html',
  styleUrl: './lead-approval-history.component.css'
})
export class LeadApprovalHistoryComponent {
  RoleId: number = +localStorage.getItem('RoleId')!;
  activeTab: string = '';
   constructor() {
    if (this.RoleId === 12) {
      this.activeTab = 'video';
    } else if (this.RoleId === 11) {
      this.activeTab = 'poster';  
    } else if (this.RoleId === 10) {
      this.activeTab = 'content';
    }
    else {
      this.activeTab = 'content'; // or any default you want
    }
  }
}
