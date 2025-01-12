import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone:false,
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})

export class AddEmployeeComponent {

  personalDetailsForm: FormGroup
  constructor(private fb: FormBuilder){
    this.personalDetailsForm = this.fb.group({
      firstName: ['',Validators.required],
      middleName: [''],
      lastName: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      maritalStatus: ['',Validators.required],
      contactNumber: ['', [Validators.required,Validators.pattern( "/^[0-9]{10}$/")]],
      emailId: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      fatherName: [''],
      fatherNumber: ['',Validators.pattern( "/^[0-9]{10}$/")],
      fatherEmailId: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      motherName: [''],
      motherNumber: ['',Validators.pattern( "/^[0-9]{10}$/")],
      motherEmailId: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      spouseName: [''],
      spouseNumber: ['',Validators.pattern( "/^[0-9]{10}$/")],
      spouseEmailId: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      emergencyContact: ['',Validators.required],
      otherPersonName: [''],
      otherPersonNumber: ['',Validators.pattern( "/^[0-9]{10}$/")],
      otherPersonEmail: ['',Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")],
      otherPersonRelation: ['']
    })
  }
 

  ngOnInit(){}

  disableNext(){
    return true
  }
}
