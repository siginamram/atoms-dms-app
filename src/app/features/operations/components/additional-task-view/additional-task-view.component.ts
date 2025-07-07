import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-additional-task-view',
  standalone: false,
  templateUrl: './additional-task-view.component.html',
  styleUrls: ['./additional-task-view.component.css']
})
export class AdditionalTaskViewComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = [
    'sno',
    'clientName',
    'clientType',
    'creativeType',
    'deadline',
    'contentWriter',
    'designer',
    'clientApproval',
    'leadApproval',
    'submissionDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);

  constructor(private dialog: MatDialog,private router:Router ) {}

  ngOnInit() {
    this.loadDummyData();
  }

  loadDummyData() {
    this.dataSource.data = [
      {
        clientName: 'ABC Corp',
        clientType: 'Existing',
        creativeType: 'Logo',
        deadline: new Date(),
        contentWriter: 'John Doe',
        designer: 'Jane Smith',
        clientApproval: 'Pending',
        leadApproval: 'Approved',
        submissionDate: '01/07/2025'
      }
    ];
  }
// Add this method to your class
editTask(row: any): void {
  // TODO: Implement edit logic here, e.g., open a dialog or navigate to edit page
  console.log('Edit task:', row);
}
  openAddTaskPopup() {
    // Add dialog open logic
    this.router.navigate([`/home/operations/additional-task-add`]);
  }
}