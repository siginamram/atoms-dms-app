import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from '../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-employee-update-salary-status',
  standalone:false,
  templateUrl: './employee-update-salary-status.component.html',
  styleUrl: './employee-update-salary-status.component.css'
})
export class EmployeeUpdateSalaryStatusComponent implements OnInit {
  isEditMode = false;
  editId: number = 0;
  expenseForm = new FormGroup({
    id: new FormControl(0),
    date: new FormControl('', Validators.required),
    person: new FormControl('', [Validators.required, Validators.minLength(3)]),
    paidamount: new FormControl('', [Validators.required, Validators.min(1)]),
    status: new FormControl('', Validators.required),
    remarks: new FormControl(''),
    source:new FormControl('', Validators.required)
  });



  constructor(
    private employeesService: EmployeesService, // Inject EmployeesService
    public dialogRef: MatDialogRef<EmployeeUpdateSalaryStatusComponent>,
    private dialog: MatDialog, // Inject MatDialog
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('Component initialized with data:', this.data);
    if (this.data && this.data.transactionId) {
      this.isEditMode = true;
      this.editId = this.data.transactionId;
      this.bindData(this.data);
      console.log('Edit Mode: Binding data', this.data);
    } else {
      console.log('Add Mode: No data received for editing.');
      this.isEditMode = true;
    }
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }
  private formatDate1(dateString: string): string {
    if (!dateString) return ''; // Handle empty date
    
    const parts = dateString.split('/'); // Split "01/03/2025" -> ["01", "03", "2025"]
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Convert to "YYYY-MM-DD"
    }
    return ''; // Return empty if invalid format
  }
  
  bindData(data: any): void {
    console.log('Before Binding:', data); // Log the received data
    this.expenseForm.patchValue({
      id: data.transactionId || 0,
      date: data.paymentDate ? this.formatDate1(data.paymentDate) : '',
      person: data.employeeName || '',
      paidamount: data.paymentAmount || '',
      status: data.paymentStatus || '',
      remarks: data.remarks || '',
      source: data.paymentMode || ''

    });
    console.log('Form Values After Binding:', this.expenseForm.value);
  }
  

  // Utility function to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitExpense() {
    if (this.expenseForm.invalid) {
      return; // Stop if the form is invalid
    }

    const formData = this.expenseForm.value;
    const userId = +localStorage.getItem('UserID')!;
    const payload = {
      transactionId: this.isEditMode ? formData.id : 0,
      paymentDate: this.formatDate(new Date(this.expenseForm.get('date')?.value || '')),
      employeeName: formData.person,
      paymentAmount: formData.paidamount || 0,
      paymentStatus: formData.status || '',
      remarks:formData.remarks || '',
      createdBy: userId,
      paymentMode: formData.source || ''
    };
    
    this.employeesService.UpdateSalaryStatusByID(payload).subscribe({
      next: (response:any) => {
        this.openAlertDialog('Success', 'Status saved Successfully!');
        console.log('API Response:', response);
        this.dialogRef.close(response);
      },
      error: (error:any) => {
        this.openAlertDialog('Error', error || 'Unexpected response. Please try again.');
        console.error('API Error:', error);
      },
    });
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
}
