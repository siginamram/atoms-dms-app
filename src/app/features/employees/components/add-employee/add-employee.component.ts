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
  empName: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private Router: Router,
    private route: ActivatedRoute,
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
      fatherName: ['',Validators.required],
      fatherNumber: ['', Validators.pattern("^[0-9]{10}$")],
      fatherEmailId: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      motherName: ['',Validators.required],
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
    this.route.queryParams.subscribe((params) => {
      const empIdFromParams = params['empid'];
      this.userId = empIdFromParams ? +empIdFromParams : 0;
      this.empName=params['empName'];
      // If empid is not passed in query params, check localStorage
      if (!this.userId) {
        const storedId = localStorage.getItem('EmployeeData');
        this.userId = storedId ? parseInt(storedId, 10) : 0;
      }
    
      console.log("Employee Id", this.userId);
    
      if (this.userId) {
        this.basicEmpData();
      } else {
        console.log("No employeeId found in query params or localStorage");
      }
    });
    
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
    const details = this.statistics.data?.personalDetails;
    const relations = this.statistics.data?.relations || [];
  
    this.personalDetailsForm.patchValue({
      firstName: details.firstName || '',
      middleName: details.middleName || '',
      lastName: details.lastName || '',
      dateOfBirth: details.dateOfBirth || '',
      maritalStatus: +details.maritalStatus || null,   // Ensure number
      gender: +details.gender || null,                 // Ensure number
      contactNumber: details.primaryContactNumber || '',
      alternateContactNumber: details.secondaryContactNumber || '',
      emailId: details.mailId || '',
      alternateEmailId: '', // Not returned by API, leave blank
  
      // Default family fields
      fatherName: '',
      fatherNumber: '',
      fatherEmailId: '',
      motherName: '',
      motherNumber: '',
      motherEmailId: '',
      spouseName: '',
      spouseNumber: '',
      spouseEmailId: '',
      emergencyContact: '',
      otherPersonRelation: '',
      otherPersonName: '',
      otherPersonNumber: '',
      otherPersonEmail: ''
    });
  
    // Loop through all relations and bind each accordingly
    for (const relation of relations) {
      if (relation.isEmergencyContact) {
        this.personalDetailsForm.patchValue({
          emergencyContact: +relation.relationshipId
        });
      }
  
      switch (relation.relationshipId) {
        case 1: // Father
          this.personalDetailsForm.patchValue({
            fatherName: relation.name,
            fatherNumber: relation.phoneNumber,
            fatherEmailId: relation.emailId
          });
          break;
  
        case 2: // Mother
          this.personalDetailsForm.patchValue({
            motherName: relation.name,
            motherNumber: relation.phoneNumber,
            motherEmailId: relation.emailId
          });
          break;
  
        case 3: // Spouse
          this.personalDetailsForm.patchValue({
            spouseName: relation.name,
            spouseNumber: relation.phoneNumber,
            spouseEmailId: relation.emailId
          });
          break;
  
        case 4: // Other
          this.personalDetailsForm.patchValue({
            otherPersonRelation: relation.relationshipId,
            otherPersonName: relation.name,
            otherPersonNumber: relation.phoneNumber,
            otherPersonEmail: relation.emailId
          });
          break;
      }
    }
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

  saveDraft() {
    this.isLoading = true;
  
    const form = this.personalDetailsForm;
  
    const payload = {
      personalDetails: {
        employeeId: this.userId,
        firstName: form.get('firstName')?.value,
        lastName: form.get('lastName')?.value,
        middleName: form.get('middleName')?.value,
        dateOfBirth: this.formatDate(new Date(this.personalDetailsForm.get('dateOfBirth')?.value || '')),
        maritalStatus: form.get('maritalStatus')?.value,
        primaryContactNumber: form.get('contactNumber')?.value,
        secondaryContactNumber: form.get('alternateContactNumber')?.value,
        gender: form.get('gender')?.value,
        profilePhoto: " ",
        mailId: form.get('emailId')?.value
      },
      relations: [] as Relation[]
    };
  
    const emergencyContact = form.get('emergencyContact')?.value;
  
    // Father
    if (emergencyContact === 1 || form.get('fatherNumber')?.value) {
      payload.relations.push({
        relationshipId: 1,
        relationshipName: 'Father',
        name: form.get('fatherName')?.value,
        emailId: form.get('fatherEmailId')?.value,
        phoneNumber: form.get('fatherNumber')?.value,
        isEmergencyContact: emergencyContact === 1
      });
    }
  
    // Mother
    if (emergencyContact === 2 || form.get('motherNumber')?.value) {
      payload.relations.push({
        relationshipId: 2,
        relationshipName: 'Mother',
        name: form.get('motherName')?.value,
        emailId: form.get('motherEmailId')?.value,
        phoneNumber: form.get('motherNumber')?.value,
        isEmergencyContact: emergencyContact === 2
      });
    }
  
    // Spouse
    if (emergencyContact === 3 || form.get('spouseNumber')?.value) {
      payload.relations.push({
        relationshipId: 3,
        relationshipName: 'Spouse',
        name: form.get('spouseName')?.value,
        emailId: form.get('spouseEmailId')?.value,
        phoneNumber: form.get('spouseNumber')?.value,
        isEmergencyContact: emergencyContact === 3
      });
    }
  
    // Other
    if (emergencyContact === 4) {
      payload.relations.push({
        relationshipId: form.get('otherPersonRelation')?.value,
        relationshipName: 'Other',
        name: form.get('otherPersonName')?.value,
        emailId: form.get('otherPersonEmail')?.value,
        phoneNumber: form.get('otherPersonNumber')?.value,
        isEmergencyContact: true
      });
    }
  
    this.commanApiService.UpdateEmployee(payload).subscribe({
      next: (response: string) => {
        if (response === 'Success') {
          this.openAlertDialog('Success', 'Employee Data Saved Successfully!');
          //this.Router.navigate(['/home/employees/employee-education']);
          this.Router.navigate([`/home/employees/employee-dashboard`], {
            queryParams: {
              empid: this.userId,
              empName:this.empName
            }
          });
        } else {
          this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred while saving the draft.';
        this.openAlertDialog('Error', errorMessage);
        this.isLoading = false;
      }
    });
  }
  
  goBack(): void {
    this.Router.navigate([`/home/employees/employee-dashboard`], {
      queryParams: {
        empid: this.userId,
        empName:this.empName
      }
    });
  }
  disableNext() {
    return true;
  }
}
