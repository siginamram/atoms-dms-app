import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emloyeep-educationdetails',
  standalone: false,
  templateUrl: './emloyeep-educationdetails.component.html',
  styleUrls: ['./emloyeep-educationdetails.component.css']
})
export class EmloyeepEducationdetailsComponent implements OnInit {
  educationForm: FormGroup;
  educationTypes = [
    { id: 1, name: 'SSC' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Degree' },
    { id: 4, name: 'Post-Graduation' },
    { id: 5, name: 'Diploma' }
  ];
  userId: number = 0;
  isLoading: boolean = false;
  empName: any;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private Router: Router,
  ) {
    this.educationForm = this.fb.group({
      employeeId: [0],
      educationDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const empIdFromParams = params['empid'];
      this.empName=params['empName'];
      this.userId = empIdFromParams ? +empIdFromParams : 0;

      if (!this.userId) {
        const storedId = localStorage.getItem('EmployeeData');
        this.userId = storedId ? parseInt(storedId, 10) : 0;
      }

      if (this.userId) {
        this.educationForm.get('employeeId')?.setValue(this.userId);
        this.getEducationDetails(this.userId);
      } else {
        console.log("No employeeId found in query params or localStorage");
      }
    });
  }

  get educationControls() {
    return (this.educationForm.get('educationDetails') as FormArray);
  }

  get educationDetails(): FormArray {
    return this.educationForm.get('educationDetails') as FormArray;
  }

  getEducationDetails(id: number): void {
    this.isLoading = true;
    this.employeeService.GetEmployeeEducationDetails(id).subscribe({
      next: (res: any[]) => {
        if (res.length) {
          res.forEach(detail => this.educationDetails.push(this.createEducationGroup(detail)));
        } else {
          this.addEducation();
        }
        this.isLoading = false;
      },
      error: () => {
        this.addEducation();
        this.isLoading = false;
      }
    });
  }

  createEducationGroup(detail: any = {}): FormGroup {
    return this.fb.group({
      educationId: [detail.educationId || 0],
      courseId: [detail.courseId || '', Validators.required],
      courseName: [detail.courseName || '', Validators.required],
      institutionalName: [detail.institutionalName || '', Validators.required],
      universityName: [detail.universityName || '', Validators.required],
      specialization: [detail.specialization || '', Validators.required],
      yearOfCompletion: [detail.yearOfCompletion || '', Validators.required],
      percentage: [detail.percentage || '', [Validators.required, Validators.max(100)]],
      educationFileUrl: [detail.educationFileUrl || ''],
      document: this.fb.group({
        fileName: [''],
        fileBytes: ['']
      })
    });
  }

  addEducation(): void {
    this.educationDetails.push(this.createEducationGroup());
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.educationDetails.at(index).patchValue({
          educationFileUrl: file.name,
          document: {
            fileName: file.name,
            fileBytes: base64String
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.educationForm.valid) {
      const payload = {
        employeeId: this.educationForm.get('employeeId')?.value,
        educationDetails: this.educationDetails.value
      };
      this.isLoading = true;
      this.employeeService.UploadEmployeeEducationDetails(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.openAlertDialog('Success', 'Education details uploaded successfully.');
          this.Router.navigate([`/home/employees/employee-dashboard`], {
            queryParams: {
              empid: this.userId,
              empName:this.empName
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('API Error:', err);
          this.openAlertDialog('Error', 'Failed to upload education details. Please try again.');
        }
      });
    } else {
      this.isLoading = false;
      this.openAlertDialog('Validation Error', 'Please fill all required fields correctly.');
    }
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type: title.toLowerCase()
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
}