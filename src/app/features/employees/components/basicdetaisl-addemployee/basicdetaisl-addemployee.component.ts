import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeesService } from '../../services/employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-basicdetaisl-addemployee',
  standalone: false,
  templateUrl: './basicdetaisl-addemployee.component.html',
  styleUrls: ['./basicdetaisl-addemployee.component.css']
})
export class BasicdetaislAddemployeeComponent {
  @Input() UserID: any;
maxDate: Date = new Date(); // Today's date
  firstName = '';
  lastName = '';
  dateOfBirth: any = null;
  EmailId = '';
  primaryContactNumber = '';
  gender: number = 1;
  genderOptions = [
    { id: 1, label: 'Male' },
    { id: 2, label: 'Female' },
    { id: 3, label: 'Other' }
  ];

  selectedDepartmentName = '';
  selectedDepartmentId = 0;
  alldeparments: any[] = [];
  filteredDeparments: any[] = [];

  selectedRoleName = '';
  selectedRoleId = 0;
  allRolles: any[] = [];
  filteredRoles: any[] = [];

  selectedManagerName = '';
  selectedManagerId = 0;
  managerList: any[] = [];
  filteredManagers: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<BasicdetaislAddemployeeComponent>,
    private commanApiService: EmployeesService,
    private route: ActivatedRoute,
    private Router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); // Set max date to 18 years ago
    this.fetchAlldepartments();
    this.fetchAllRoles();
    this.fetchManagers();
  }

  fetchAlldepartments(): void {
    this.commanApiService.getAllDepartments().subscribe({
      next: (res: any[]) => {
        this.alldeparments = res;
        this.filteredDeparments = res;
      }
    });
  }

  onDeparmentSelected(event: any): void {
    const selected = this.alldeparments.find(d => d.departmentName === event.option.value);
    if (selected) {
      this.selectedDepartmentId = selected.departmentId;
    }
  }

  filterDeparments(event: any): void {
    const val = event.target.value.toLowerCase();
    this.filteredDeparments = this.alldeparments.filter(d => d.departmentName.toLowerCase().includes(val));
  }

  fetchAllRoles(): void {
    this.commanApiService.getAllRolls().subscribe({
      next: (res: any[]) => {
        this.allRolles = res;
        this.filteredRoles = res;
      }
    });
  }

  onRoleSelected(event: any): void {
    const selected = this.allRolles.find(r => r.roleName === event.option.value);
    if (selected) {
      this.selectedRoleId = selected.roleID;
    }
  }

  filterRoles(event: any): void {
    const val = event.target.value.toLowerCase();
    this.filteredRoles = this.allRolles.filter(r => r.roleName.toLowerCase().includes(val));
  }

  fetchManagers(): void {
    this.commanApiService.getAllEmployeesList().subscribe({
      next: (res: any[]) => {
        this.managerList = res;
        this.filteredManagers = res;
      }
    });
  }

  onManagerSelected(event: any): void {
    const selected = this.managerList.find(m => `${m.firstName} ${m.lastName}` === event.option.value);
    if (selected) {
      this.selectedManagerId = selected.employeeId;
    }
  }

  filterManagers(event: any): void {
    const val = event.target.value.toLowerCase();
    this.filteredManagers = this.managerList.filter(m =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(val));
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const char = event.key.charCodeAt(0);
    if (char < 48 || char > 57) event.preventDefault();
  }

  isInvalidPhone(): boolean {
    return !!this.primaryContactNumber && !/^[6-9]\d{9}$/.test(this.primaryContactNumber);
  }

  
isAgeValid(): boolean {
  if (!this.dateOfBirth) return true;
  const today = new Date();
  const dob = new Date(this.dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }

    // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
submit(): void {
  if (
    !this.firstName ||
    !this.lastName ||
    !this.dateOfBirth ||
    !this.EmailId ||
    !this.primaryContactNumber ||
    !this.gender ||
    !this.selectedDepartmentId ||
    !this.selectedRoleId ||
    !this.selectedManagerId
  ) {
    this.openAlertDialog('Error', 'Please fill all required fields.');
    return;
  }

  if (this.isInvalidPhone()) {
    this.openAlertDialog('Error', 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
    return;
  }
  if (!this.isAgeValid()) {
    this.openAlertDialog('Error', 'Employee must be at least 18 years old.');
    return;
  }

  const payload = {
    dateOfBirth: this.formatDate(new Date(this.dateOfBirth)),
    firstName: this.firstName,
    lastName: this.lastName,
    emailId: this.EmailId,
    departmentId: this.selectedDepartmentId,
    roleId: this.selectedRoleId,
    managerId: this.selectedManagerId,
    primaryContactNumber: this.primaryContactNumber,
    gender: this.gender
  };

  this.commanApiService.addEmployee(payload).subscribe({
    next: (res: any) => {
      if (res.message === 'Employee Created Successfully') {
        this.openAlertDialog('Success', 'Employee Created Successfully!');
        this.closeDialog();
        this.Router.navigate(['/home/employees/employee-dashboard'], {
          queryParams: { empid: res.employeeId }
        });
      } else {
        this.openAlertDialog('Info', res.message);
        this.closeDialog();
        this.Router.navigate(['/home/employees/listofemployees']);
      }
    }
  });
}

}
