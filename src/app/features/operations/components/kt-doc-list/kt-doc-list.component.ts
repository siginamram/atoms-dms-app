import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { OperationsService } from '../../services/operations.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-kt-doc-list',
  standalone: false,
  
  templateUrl: './kt-doc-list.component.html',
  styleUrl: './kt-doc-list.component.css'
})
export class KtDocListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  activeFilter: string | null = null;
  organizationFilter = new FormControl('');
  displayedColumns: string[] = [
    'id',
    'organizationName',
    'ktDocUrl'
  ];
  dataSource: any = [];
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10); 
  constructor(private readonly operationsService:OperationsService ){}
  ngOnInit(){
    this.getKTDocumentsByUserId()
    this.organizationFilter.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter(): void {
    const organization = this.organizationFilter.value?.toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any) =>
      (!organization || data.organizationName?.toLowerCase().includes(organization));
    this.dataSource.filter = Math.random().toString(); // Trigger filter refresh
  }

   getKTDocumentsByUserId(){
    this.operationsService.getKTDocumentByUserId(this.userId).subscribe({
      next: (response: any[]) => {
        this.dataSource = response?.map((item,index) => ({
          ...item,
          id: index + 1, // Add serial number dynamically
        }));
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
        this.dataSource.data = []; // Clear table on error
      },
    });
   }

   redirectToWebsite(ele:any): void {
    const url = ele?.ktDocUrl// Replace with your target URL
    window.open(url, '_blank'); // Open in a new tab
  }

  toggleFilter(column: string, event?: MouseEvent): void {
    // Check if the clicked element is part of the filter input
    if (
      event?.target instanceof HTMLElement &&
      event.target.closest('.column-filter-container') &&
      this.activeFilter === column
    ) {
      return; // Do nothing if clicking inside the filter container
    }

    // Toggle the filter visibility for the clicked column
    this.activeFilter = this.activeFilter === column ? null : column;
  }

}
