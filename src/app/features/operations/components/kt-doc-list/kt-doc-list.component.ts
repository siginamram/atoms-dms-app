import { Component, HostListener, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { OperationsService } from '../../services/operations.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-kt-doc-list',
  standalone:false,
  templateUrl: './kt-doc-list.component.html',
  styleUrls: ['./kt-doc-list.component.css'],
})
export class KtDocListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeFilter: string | null = null;
  organizationFilter = new FormControl('');
  displayedColumns: string[] = ['id', 'organizationName', 'ktDocUrl'];
  dataSource = new MatTableDataSource<any>(); // Use MatTableDataSource
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  constructor(private readonly operationsService: OperationsService) {}

  ngOnInit(): void {
    this.getKTDocumentsByUserId();

    // Listen to filter value changes
    this.organizationFilter.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter(): void {
    const organization = this.organizationFilter.value?.trim().toLowerCase() || '';
    this.dataSource.filter = organization;
  }

  getKTDocumentsByUserId(): void {
    this.operationsService.getKTDocumentByUserId(this.userId).subscribe({
      next: (response: any[]) => {
        // Map response data to add serial numbers
        const formattedData = response?.map((item, index) => ({
          ...item,
          id: index + 1, // Add serial number dynamically
        }));
        this.dataSource = new MatTableDataSource(formattedData); // Assign data to MatTableDataSource
        this.dataSource.paginator = this.paginator; // Attach paginator
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          // Custom filter logic for organization name
          const organizationName = data.organizationName?.toLowerCase() || '';
          return organizationName.includes(filter);
        };
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
        this.dataSource.data = []; // Clear table on error
      },
    });
  }

  redirectToWebsite(ele: any): void {
    const url = ele?.ktDocUrl; // Replace with your target URL
    window.open(url, '_blank'); // Open in a new tab
  }

  toggleFilter(column: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent event propagation to HostListener
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close the filter if clicked outside
    const clickedInside = (event.target as HTMLElement).closest(
      '.filter-header, .column-filter-container'
    );
    if (!clickedInside) {
      this.activeFilter = null;
    }
  }
}
