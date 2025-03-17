import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-atoms-expenses',
  standalone: false,
  templateUrl: './add-atoms-expenses.component.html',
  styleUrls: ['./add-atoms-expenses.component.css']
})
export class AddAtomsExpensesComponent {
  expenseForm = new FormGroup({
    date: new FormControl(''),
    person: new FormControl(''),
    purpose: new FormControl(''),
    amountSpent: new FormControl(''),
    invoice: new FormControl(''),
    voucher: new FormControl(''),
    source: new FormControl(''),
    remarks: new FormControl('')
  });

  purposeList: string[] = [
    'AD Budget',
    'GST',
    'Salaries',
    'Rent',
    'Power Bill',
    'Monthly Groceries & Essentials',
    'Snacks',
    'Milk',
    'Water',
    'Expenses of Operational Transportation',
    'Marketing Expenses',
    'Mobile Recharges',
    'WiFi Recharges',
    'Others',
    'Employee Benefits'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddAtomsExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitExpense() {
    console.log('Expense Data:', this.expenseForm.value);
    this.dialogRef.close(this.expenseForm.value);
  }
}
