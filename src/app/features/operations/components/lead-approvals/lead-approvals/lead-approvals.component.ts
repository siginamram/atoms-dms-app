import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-approvals',
 standalone:false,
  templateUrl: './lead-approvals.component.html',
  styleUrl: './lead-approvals.component.css'
})
export class LeadApprovalsComponent {
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
