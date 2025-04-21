import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-work-experience',
  standalone: false,
  templateUrl: './employee-work-experience.component.html',
  styleUrls: ['./employee-work-experience.component.css']
})
export class EmployeeWorkExperienceComponent implements OnInit {
  workExperienceForm: FormGroup;
  userId: number = 0;
  empName: string = '';
  viewExperiences: any[] = [];
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private empService: EmployeesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.workExperienceForm = this.fb.group({
      employeeId: [0],
      previousCompanyInfos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['empid'] ? +params['empid'] : parseInt(localStorage.getItem('EmployeeData') || '0', 10);
      this.empName = params['empName'] || '';

      if (this.userId) {
        this.workExperienceForm.get('employeeId')?.setValue(this.userId);
        this.loadExperiences();
      }
    });
  }

  get experienceControls(): FormArray {
    return this.workExperienceForm.get('previousCompanyInfos') as FormArray;
  }

  loadExperiences(): void {
    //this.isLoading = true;
    this.empService.GetExperienceDetails(this.userId).subscribe((res: any[]) => {
      this.viewExperiences = res;
      if (res && res.length) {
       // this.isLoading = false;
        res.forEach(exp => this.experienceControls.push(this.createExperienceForm(exp)));
      } else {
        this.addExperience();
      }
    });
  }

  createExperienceForm(data: any = {}): FormGroup {
    return this.fb.group({
      experienceId: [data.experienceId || 0],
      nameOfOrganisation: [data.nameOfOrganisation || '', Validators.required],
      role: [data.role || '', Validators.required],
      noOfMonths: [data.noOfMonths || '', Validators.required],
      startDate: [data.startDate || '', Validators.required],
      endDate: [data.endDate || '', Validators.required],
      paySlipUrl: [data.paySlipUrl || ''],
      relievingLetterUrl: [data.relievingLetterUrl || ''],
      paySlip: this.fb.group({
        fileName: [''],
        fileBytes: ['']
      }),
      relievingLetter: this.fb.group({
        fileName: [''],
        fileBytes: ['']
      })
    });
  }

  addExperience(): void {
    this.experienceControls.push(this.createExperienceForm());
  }

  onFileChange(event: any, index: number, field: 'paySlip' | 'relievingLetter'): void {
    const file = event.target.files[0];
    
    if (!file) return;
  
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      this.openAlertDialog('Invalid File Type', 'Only PDF, JPG, or PNG files are allowed.');
      return;
    }
  
    // Validate file size
    if (file.size > maxSize) {
      this.openAlertDialog('File Too Large', 'File size should not exceed 2MB.');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const safeFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      this.experienceControls.at(index).get(field)?.patchValue({
        fileName: safeFileName,
        fileBytes: base64
      });
    };
    reader.onerror = () => {
      this.openAlertDialog('Read Error', 'Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  }
  
  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onSubmit(): void {
    // Step 1: Validate the form
    if (this.workExperienceForm.invalid) {
      this.openAlertDialog('Validation Error', 'Please fill all required fields correctly.');
      return;
    }
  
    // Step 2: Show loader
    this.isLoading = true;
  
    // Step 3: Prepare payload
    const payload = {
      employeeId: this.userId,
      previousCompanyInfos: this.experienceControls.value.map((exp: any) => ({
        experienceId: exp.experienceId || 0,
        nameOfOrganisation: exp.nameOfOrganisation,
        role: exp.role,
        noOfMonths: exp.noOfMonths,
        startDate: this.formatDate(new Date(exp.startDate)),
        endDate: this.formatDate(new Date(exp.endDate)),
        paySlipUrl: exp.paySlipUrl,
        relievingLetterUrl: exp.relievingLetterUrl,
        paySlip: {
          fileName: exp.paySlip?.fileName || '',
          fileBytes: exp.paySlip?.fileBytes || ''
        },
        relievingLetter: {
          fileName: exp.relievingLetter?.fileName || '',
          fileBytes: exp.relievingLetter?.fileBytes || ''
        }
      }))
    };
  
    // Step 4: Call API
    this.empService.UploadExperienceDetails(payload).subscribe({
      next: () => {
        this.openAlertDialog('Success', 'Work experience uploaded successfully.');
        this.router.navigate(['/home/employees/employee-dashboard'], {
          queryParams: {
            empid: this.userId,
            empName: this.empName
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('API Error:', err);
        this.openAlertDialog('Error', 'Failed to upload work experience. Please try again.');
      }
    }).add(() => {
      // Step 5: Always hide loader (finally block equivalent)
      this.isLoading = false;
    });
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
    this.router.navigate(['/home/employees/employee-dashboard'], {
      queryParams: {
        empid: this.userId,
        empName: this.empName
      }
    });
  }
}
