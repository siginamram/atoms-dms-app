import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-salary-details',
 standalone: false,
  templateUrl: './employee-salary-details.component.html',
  styleUrl: './employee-salary-details.component.css'
})
export class EmployeeSalaryDetailsComponent implements OnInit {
  salaryForm!: FormGroup;
  userId = 0;
  empName: string = '';
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    this.userId = +params['empid'] || 0;
    this.empName = params['empName'] || 'Employee';

    if (!this.userId) {
      const stored = localStorage.getItem('EmployeeData');
      this.userId = stored ? parseInt(stored, 10) : 0;
    }

    this.initForm();

    // Auto-calculate perday from basePay
    this.salaryForm.get('basePay')?.valueChanges.subscribe((value: number) => {
      if (value && value > 0) {
        const perday = Math.floor(value / 25);
        this.salaryForm.get('perday')?.setValue(perday, { emitEvent: false });
      } else {
        this.salaryForm.get('perday')?.reset();
      }
    });

    if (this.userId) {
      this.loadSalaryDetails();
    } else {
      this.isLoading = false;
      console.log('Invalid employee ID');
    }
  });
}


  initForm(): void {
    this.salaryForm = this.fb.group({
      basePay: [0, [Validators.required, Validators.min(0)]],
      perday: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadSalaryDetails(): void {
    this.employeeService.GetSalaryDetails(this.userId).subscribe({
      next: (data) => {
        this.salaryForm.patchValue({
          basePay: data.basePay,
          perday: data.perday
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed to fetch salary details');
      }
    });
  }

  onSubmit(): void {
    if (this.salaryForm.invalid) return;

    const payload = {
      employeeId: this.userId,
      basePay: this.salaryForm.value.basePay,
      perday: this.salaryForm.value.perday,
      userId: 1 // Or fetch from logged-in user context
    };

    this.isSubmitting = true;
    this.employeeService.UpdateSalaryDetails(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
            this.openAlertDialog('Success', 'Salary details updated successfully.');
        //alert('Salary updated successfully.');
      },
      error: () => {
        this.isSubmitting = false;
          this.openAlertDialog('Error', 'Failed to upload education details. Please try again.');
        //alert('Failed to update salary.');
      }
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
