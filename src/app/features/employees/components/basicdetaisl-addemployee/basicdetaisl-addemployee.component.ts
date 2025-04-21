import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeesService } from '../../services/employees.service';
import { ActivatedRoute,Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-basicdetaisl-addemployee',
  standalone: false,
  templateUrl: './basicdetaisl-addemployee.component.html',
  styleUrl: './basicdetaisl-addemployee.component.css'
})
export class BasicdetaislAddemployeeComponent {

  @Input() UserID:any;

  firstName:string = '';
  lastName:string = '';
  dateOfBirth: any | null = null;
  selecteddepartmentName:string = '';
  EmailId:string = '';
  alldeparments: any[] = [];
  filteredDeparments: any[] = [];
  data: any;

  selectedRoleName:string = '';
  filteredRoles: any[] = [];
  allRolles: any[] = [];
  dataRole:any;
  showSpinner: boolean = false;

constructor(public dialogRef: MatDialogRef<BasicdetaislAddemployeeComponent>,
  private commanApiService: EmployeesService,
  private route: ActivatedRoute,
  private Router: Router,
  private dialog: MatDialog // Inject MatDialog
) {}

ngOnInit(): void {
  this.fetchAlldepartments();
  this.fetchAllRoles();
}


  onClose(): void {
    this.dialogRef.close();
  }

  // Getting All Deparments

  fetchAlldepartments(): void {

    this.commanApiService.getAllDepartments().subscribe({
      next: (response: any[]) => {
        this.alldeparments = response;
        this.filteredDeparments = response; // Initially show all clients
      },
      error: (error) => {
        console.error('Error fetching active clients:', error);
      },
    });
  }

  onDeparmentSelected(event: any): void {
  
      // Find the selected role object using the roleName from the event
      const selecteddeprtName = event.option.value;
  
      // Optionally, find the full role object if you need it
      const selecteddeprt = this.alldeparments.find(role => role.departmentName === selecteddeprtName);
    
      if (selecteddeprt) {
        this.selecteddepartmentName = selecteddeprt.departmentId;  // or use `selecteddeprt` object if needed
        console.log("Selected department", this.selecteddepartmentName);
      }
  }

  filterDeparments(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDeparments = this.alldeparments.filter((deparment) =>
      deparment.organizationName.toLowerCase().includes(input)
    );
  }

   // Getting All Roles

  fetchAllRoles(): void {

    this.commanApiService.getAllRolls().subscribe({
      next: (response: any[]) => {
        this.allRolles = response;
        this.filteredRoles = response; // Initially show all clients
      },
      error: (error) => {
        console.error('Error fetching active clients:', error);
      },
    });
  }

  onRoleSelected(event: any): void {
    // Find the selected role object using the roleName from the event
    const selectedRoleName = event.option.value;
  
    // Optionally, find the full role object if you need it
    const selectedRole = this.allRolles.find(role => role.roleName === selectedRoleName);
  
    if (selectedRole) {
      this.selectedRoleName = selectedRole.roleID;  // or use `selectedRole` object if needed
      console.log("Selected role:", this.selectedRoleName);
    }
  }
  

  filterRoles(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRoles = this.allRolles.filter((role) =>
      role.roleName.toLowerCase().includes(input)
    );
  }

    openAlertDialog(title: string, message: string): void {
      this.dialog.open(AlertDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          type: title.toLowerCase(), // success, error, or warning
        },
      });
    }

     // Method to close the dialog programmatically
  closeDialog(): void {
    this.dialogRef.close();
  }

  submit(): void {
    console.log({
      DOB: this.dateOfBirth,
      firstname: this.firstName,
      lastname: this.lastName,
      EmailId:this.EmailId,
      department: this.selecteddepartmentName,
      role: this.selectedRoleName
    });

  let payload = {
    dateOfBirth: this.dateOfBirth,
    firstName: this.firstName,
    lastName: this.lastName,
    emailId:this.EmailId,
    departmentId: this.selecteddepartmentName,
    roleId: this.selectedRoleName
  };
 
  this.commanApiService.addEmployee(payload).subscribe({
      next: (response: any) => {
        debugger;
        if(response.message == 'Employee Created Successfully')
        {
          console.log("response is",response)
          this.openAlertDialog('Success', 'Employee Created Successfully!');
          // this.Router.navigate(['/home/employees/listofemployees']);
          this.closeDialog();
          this.Router.navigate([`/home/employees/employee-dashboard`], {
            queryParams: {
              empid:response.employeeId
            }
          });
          localStorage.setItem('EmployeeData', response.employeeId);
          console.log("emp binded",localStorage.setItem('EmployeeData', response.employeeId));
        }
      
      else if(response.message == 'Employee Already Exists')
      {
        this.openAlertDialog('Success', response.message);
        this.closeDialog();
        this.Router.navigate(['/home/employees/listofemployees']);
      }
    }
    });
  }


}

