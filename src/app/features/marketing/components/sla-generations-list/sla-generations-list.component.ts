import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sla-generations-list',
  templateUrl: './sla-generations-list.component.html',
  styleUrls: ['./sla-generations-list.component.css'],
})
export class SlaGenerationsListComponent {
  constructor(private router: Router) {}
  displayedColumns: string[] = ['id', 'name', 'slaDate', 'city', 'actions'];
  activeTab: string = 'current'; // Default tab

  // Mock data
  slas = [
    { id: 1, name: 'Lead A', slaDate: '2024-01-01', city: 'New York' },
    { id: 2, name: 'Lead B', slaDate: '2024-01-02', city: 'Los Angeles' },
    { id: 3, name: 'Lead C', slaDate: '2024-01-03', city: 'Chicago' },
  ];

  filteredSLAs = this.slas;

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'current') {
      this.filteredSLAs = this.slas; // Filter current SLAs
    } else {
      this.filteredSLAs = []; // Filter archived SLAs (example)
    }
  }

  generateSLA(): void {
    //alert('Generate SLA clicked!');
    this.router.navigate(['/home/marketing/generate-sla']);
  }

  viewSLA(id: number): void {
    alert(`Viewing SLA with ID: ${id}`);
  }
}
