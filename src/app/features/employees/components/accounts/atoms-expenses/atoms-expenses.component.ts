import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AddAtomsExpensesComponent } from '../add-atoms-expenses/add-atoms-expenses.component';

@Component({
  selector: 'app-atoms-expenses',
  standalone: false,
  templateUrl: './atoms-expenses.component.html',
  styleUrls: ['./atoms-expenses.component.css']
})
export class AtomsExpensesComponent {
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private dialog: MatDialog,

    ) {}
  expenses = [
    { date: '01/03/2025', person: 'John Doe', purpose: 'Office Supplies', amount: 200, invoice: 'INV-001', voucher: 'VOU-001', source: 'Company', remarks: 'Approved' },
    { date: '05/03/2025', person: 'Jane Smith', purpose: 'Travel', amount: 500, invoice: 'INV-002', voucher: 'VOU-002', source: 'Client', remarks: 'Pending' },
    { date: '10/03/2025', person: 'Michael Johnson', purpose: 'Marketing', amount: 150, invoice: 'INV-003', voucher: 'VOU-003', source: 'Company', remarks: 'Approved' }
  ];

  totalExpense() {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  addExpense() {
      const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
         width: '650px',
         data: {
           isEdit: false,
           meetingData: null,
         },
       });
   
       dialogRef.afterClosed().subscribe((result) => {
         if (result) {
           //this.fetchFilteredData(); // Refresh data
         }
       });
  }

  editExpense(row: number) {
  console.log('Editing Row Data:', row); // Log the row data to verify
    const dialogRef = this.dialog.open(AddAtomsExpensesComponent, {
      width: '650px',
      data: row, // Pass the correct row data for editing
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Campaign Edited:', result);
        //this.fetchFilteredData(); // Refresh the data
      }
    });
  }
}
