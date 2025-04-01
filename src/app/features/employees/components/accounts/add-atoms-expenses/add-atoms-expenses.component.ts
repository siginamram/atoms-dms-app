import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from '../../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-atoms-expenses',
  standalone: false,
  templateUrl: './add-atoms-expenses.component.html',
  styleUrls: ['./add-atoms-expenses.component.css']
})
export class AddAtomsExpensesComponent implements OnInit {
  isEditMode = false;
  editId: number = 0;
  expenseForm = new FormGroup({
    id: new FormControl(0),
    date: new FormControl('', Validators.required),
    person: new FormControl('', [Validators.required, Validators.minLength(3)]),
    purpose: new FormControl('', Validators.required),
    amountSpent: new FormControl('', [Validators.required, Validators.min(1)]),
    type: new FormControl('', Validators.required),
    bill: new FormControl('', Validators.required),
    source: new FormControl('', Validators.required),
    remarks: new FormControl('')
  });

  purposeList: { id: number; name: string }[] = [
    { id: 1, name: 'AD Budget' },
    { id: 2, name: 'GST' },
    { id: 3, name: 'Salaries' },
    { id: 4, name: 'Rent' },
    { id: 5, name: 'Power Bill' },
    { id: 6, name: 'Monthly Groceries & Essentials' },
    { id: 7, name: 'Snacks' },
    { id: 8, name: 'Milk' },
    { id: 9, name: 'Water' },
    { id: 10, name: 'Expenses of Operational Transportation' },
    { id: 11, name: 'Marketing Expenses' },
    { id: 12, name: 'Mobile Recharges' },
    { id: 13, name: 'WiFi Recharges' },
    { id: 14, name: 'Others' },
    { id: 15, name: 'Employee Benefits' }
  ];

  constructor(
    private employeesService: EmployeesService, // Inject EmployeesService
    public dialogRef: MatDialogRef<AddAtomsExpensesComponent>,
    private dialog: MatDialog, // Inject MatDialog
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('Component initialized with data:', this.data);
    if (this.data && this.data.id) {
      this.isEditMode = true;
      this.editId = this.data.id;
      this.bindData(this.data);
      console.log('Edit Mode: Binding data', this.data);
    } else {
      console.log('Add Mode: No data received for editing.');
      this.isEditMode = false;
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
    const purposeId:any=this.purposeList.find(p => p.name === data.purpose)?.id || 0;
    this.expenseForm.patchValue({
      id: data.id || 0,
      date: data.date ? this.formatDate1(data.date) : '',
      person: data.person || '',
      purpose: purposeId,
      amountSpent: data.amount || 0,
      type: data.type || '',
      bill: data.biltype || '',
      source: data.source || '',
      remarks: data.remarks || ''
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
      id: this.isEditMode ? formData.id : 0,
      date: this.formatDate(new Date(this.expenseForm.get('date')?.value || '')),
      nameOfPerson: formData.person,
      amount: formData.amountSpent || 0,
      //purpose: this.expenseForm.get('purpose')?.value || 0,
      purpose:  formData.purpose, 
      type: formData.type || '',
      biltype: formData.bill || '',
      expensesFrom: formData.source || '',
      remarks:formData.remarks || '',
      createdBy: userId
    };
    
    this.employeesService.AddUpdateExpenses(payload).subscribe({
      next: (response:any) => {
        this.openAlertDialog('Success', 'Expenses saved Successfully!');
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