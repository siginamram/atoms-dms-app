import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute,Router } from '@angular/router';

interface Relation {
  relationshipId: any;
  relationshipName: string;
  name: any;
  emailId: any;
  phoneNumber: any;
  isEmergencyContact: boolean;
}

@Component({
  selector: 'app-add-employee',
  standalone: false,
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'] // Fixed this typo
})



export class AddEmployeeComponent  implements OnInit{



  userId: any;
  personalDetailsForm: FormGroup;
  isLoading: boolean | undefined;
  statistics: any = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private Router: Router,
    private commanApiService: EmployeesService
  ) {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      gender: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Fixed regex pattern
      alternateContactNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Fixed regex pattern
      emailId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      alternateEmailId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      fatherName: [''],
      fatherNumber: ['', Validators.pattern("^[0-9]{10}$")],
      fatherEmailId: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      motherName: [''],
      motherNumber: ['', Validators.pattern("^[0-9]{10}$")],
      motherEmailId: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      spouseName: [''],
      spouseNumber: ['',Validators.pattern( "/^[0-9]{10}$/")],
      spouseEmailId: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      emergencyContact: ['',Validators.required],

      otherPersonName: ['', Validators.required],
      otherPersonNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Fixed regex pattern
      otherPersonEmail: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      otherPersonRelation: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get the stored employeeId from localStorage
    const storedEmployeeId = localStorage.getItem('EmployeeData');
    console.log("Employee Id", storedEmployeeId);

    // Check if the item exists and parse the JSON
    if (storedEmployeeId) {
      const employeeId = storedEmployeeId; // Parse to get the number
      this.userId = employeeId; // Assign it to your variable
      console.log("Employee Id", this.userId);

      this.basicEmpData();
    } else {
      console.log("No employeeId found in localStorage");
    }
  }

  basicEmpData(): void {
    this.isLoading = true;
    this.commanApiService.getProfileDetailsbyEmpId(this.userId).subscribe(
      (data: any) => {
        this.statistics.data = data || [];
        this.BindDataEmp();
        console.log("emp Id by data", this.statistics.data);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching Employee data:', error);
        this.isLoading = false;
      }
    );
  }

  BindDataEmp() {
    this.personalDetailsForm.patchValue({
      firstName: this.statistics.data.personalDetails.firstName,
      lastName: this.statistics.data.personalDetails.lastName,
      emailId: this.statistics.data.personalDetails.mailId,
      dateOfBirth: this.statistics.data.personalDetails.dateOfBirth
    });
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }

  saveDraft() {
    debugger;
    // Perform a check to ensure required fields are filled
    this.isLoading = true;
  
      let payload = {
        personalDetails: {
          "employeeId": this.userId,
          "firstName": this.personalDetailsForm.get('firstName')?.value,
          "lastName": this.personalDetailsForm.get('lastName')?.value,
          "middleName": this.personalDetailsForm.get('middleName')?.value,
          "dateOfBirth": this.personalDetailsForm.get('dateOfBirth')?.value,
          "maritalStatus": this.personalDetailsForm.get('maritalStatus')?.value,
          "primaryContactNumber": this.personalDetailsForm.get('contactNumber')?.value,
          "secondaryContactNumber": this.personalDetailsForm.get('alternateContactNumber')?.value, // Fixed field name
          "gender": this.personalDetailsForm.get('gender')?.value,
          "profilePhoto": " ", // Placeholder for profile photo
          "mailId": this.personalDetailsForm.get('emailId')?.value
        },
        relations: [] as Relation[]
      };

      if(this.personalDetailsForm.get('fatherNumber')?.value || (this.personalDetailsForm.get('emergencyContact')?.value) == '1')
      {
        payload.relations.push({
          "relationshipId": this.personalDetailsForm.get('emergencyContact')?.value,
          "relationshipName": "Father", // example for case 1
          "name": this.personalDetailsForm.get('fatherNumber')?.value,
          "emailId": this.personalDetailsForm.get('fatherEmailId')?.value,
          "phoneNumber": this.personalDetailsForm.get('fatherNumber')?.value,
          "isEmergencyContact": (this.personalDetailsForm.get('emergencyContact')?.value) == '1' ? true : false
        });
      }
      else if(this.personalDetailsForm.get('motherName')?.value || (this.personalDetailsForm.get('emergencyContact')?.value) == '2')
      {
        payload.relations.push({
          "relationshipId": this.personalDetailsForm.get('emergencyContact')?.value,
          "relationshipName": "Mother", // example for case 2
          "name": this.personalDetailsForm.get('motherName')?.value,
          "emailId": this.personalDetailsForm.get('motherEmailId')?.value,
          "phoneNumber": this.personalDetailsForm.get('motherNumber')?.value,
          "isEmergencyContact": (this.personalDetailsForm.get('emergencyContact')?.value) == '2' ? true : false
        });
      }
      else if(this.personalDetailsForm.get('spouseName')?.value || (this.personalDetailsForm.get('emergencyContact')?.value) == '3')
        {
          payload.relations.push({
            "relationshipId": this.personalDetailsForm.get('emergencyContact')?.value,
            "relationshipName": "Spouse", // example for case 2
            "name": this.personalDetailsForm.get('spouseName')?.value,
            "emailId": this.personalDetailsForm.get('spouseEmailId')?.value,
            "phoneNumber": this.personalDetailsForm.get('spouseNumber')?.value,
            "isEmergencyContact": (this.personalDetailsForm.get('emergencyContact')?.value) == '3' ? true : false
          });
        }
        else if(this.personalDetailsForm.get('emergencyContact')?.value == '4')
          {
            payload.relations.push({
              "relationshipId": this.personalDetailsForm.get('otherPersonRelation')?.value,
              "relationshipName": "Other", // example for case 2
              "name": this.personalDetailsForm.get('otherPersonName')?.value,
              "emailId": this.personalDetailsForm.get('otherPersonEmail')?.value,
              "phoneNumber": this.personalDetailsForm.get('otherPersonNumber')?.value,
              "isEmergencyContact": (this.personalDetailsForm.get('emergencyContact')?.value) == '4' ? true : false
            });
          }
        
      this.commanApiService.UpdateEmployee(payload).subscribe({
        next: (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Draft Saved Successfully!');
            this.Router.navigate(['/home/employees/employee-dashboard']);

          } else {
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
            this.isLoading = false;
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'An unexpected error occurred while saving the draft.';
          this.openAlertDialog('Error', errorMessage);
          this.isLoading = false;
        },
      });
    
  }

  disableNext() {
    return true;
  }
}
