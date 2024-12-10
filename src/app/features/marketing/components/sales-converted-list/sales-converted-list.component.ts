import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-converted-list',
  templateUrl: './sales-converted-list.component.html',
  styleUrls: ['./sales-converted-list.component.css']
})
export class SalesConvertedListComponent implements OnInit {
  constructor(private router: Router) {}
  cityFilter: string = '';
  displayedColumns: string[] = [
    'clientName',
    'dealClosingDate',
    'ktStatus',
    'ktDate',
    'payment',
    'city',
    'actions'
  ];

  dataSource = [
    { clientName: 'John Doe', dealClosingDate: new Date(), ktStatus: 'Completed', ktDate: new Date(), payment: 'Paid', city: 'New York' },
    { clientName: 'Jane Smith', dealClosingDate: new Date(), ktStatus: 'In Progress', ktDate: new Date(), payment: 'Pending', city: 'Los Angeles' },
    { clientName: 'Bob Johnson', dealClosingDate: new Date(), ktStatus: 'Completed', ktDate: new Date(), payment: 'Paid', city: 'Chicago' },
  ];

  cities: string[] = ['New York', 'Los Angeles', 'Chicago'];
  filteredData = [...this.dataSource];

  ngOnInit(): void {}

  applyFilter() {
    if (this.cityFilter) {
      this.filteredData = this.dataSource.filter(item =>
        item.city === this.cityFilter
      );
    } else {
      this.filteredData = [...this.dataSource];
    }
  }

  editRow(row: any) {
    console.log('Editing row:', row);
    // Implement edit functionality here
    this.router.navigate(['/home/marketing/sales-convert-status-edit']);
  }
}
