import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { EmployeesService } from '../../services/employees.service';
import { LeaveApplyComponent } from '../leave-management/leave-apply/leave-apply.component';
import { BasicdetaislAddemployeeComponent } from '../basicdetaisl-addemployee/basicdetaisl-addemployee.component';

@Component({
   selector: 'app-employees-list',
  standalone:false,
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  activeTab: string = 'progressive'; // Default tab is Progressive
  displayedColumns: string[] = [];
  filteredLeads: any[] = []; // Fetched leads based on the tab
  dataSource = new MatTableDataSource<any>(); // Data source for Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator
  showSpinner: boolean = false;

  constructor(
    private router: Router,
    private commanApiService: EmployeesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.switchTab(this.activeTab); // Load default tab data
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Assign paginator after view initialization
  }

  // Switch tabs and fetch data accordingly
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.updateDisplayedColumns(); // Update columns based on tab
    this.loadLeads(); // Fetch data for the selected tab
  }

  // Update displayed columns based on the active tab
  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'id',
      'organizationName',
      'salesperson',
      'reporedDate',
      'cityName',
      'pocName',
      'pocContact',
      'actions', // Actions available in all tabs
    ];
  }

  // Load leads based on the active tab
  loadLeads(): void {
    this.showSpinner = true
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = this.activeTab === 'progressive' ? 1 : 3; // Determine status based on the tab

    this.commanApiService.getAllEmployeesList().subscribe(
      (data: any) => {
        console.log(`Fetched Leads for ${this.activeTab} tab:`, data);
        this.filteredLeads = data; // Bind fetched data to the table
        this.dataSource.data = this.filteredLeads; // Update data source
        this.showSpinner = false
      },
      (error) => {
        console.error(`Failed to fetch ${this.activeTab} leads:`, error);
        this.filteredLeads = []; // Clear the table if there is an error
        this.dataSource.data = [];
        this.showSpinner = false
      }
    );
  }

  // Navigate to Add Lead page
  Register(): void {
    // this.router.navigate(['/home/employees/AddComponent']);
      this.dialog.open(BasicdetaislAddemployeeComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container',
      });
  }
 // Navigate to Employee
  editEmployee(row: any): void {
    console.log('Editing meet with ID:', row);
    //this.router.navigate(['/home/employees/employee-dashboard', row]);

    this.router.navigate([`/home/employees/employee-dashboard`], {
      queryParams: {
        empid:row.employeeId,
        empName:row.firstName
      }
    });
  }

 

}
