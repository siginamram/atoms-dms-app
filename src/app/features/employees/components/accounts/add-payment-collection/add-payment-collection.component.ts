import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-add-payment-collection',
  standalone:false,
  templateUrl: './add-payment-collection.component.html',
  styleUrls: ['./add-payment-collection.component.css']
})
export class AddPaymentCollectionComponent implements OnInit {
  paymentForm: FormGroup;
  paymentId: number = 0;
  selectedDate: string = '';
  datePickerRefs: any[] = [];
  paymentStatusOptions = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Paid' }
  ];

  paymentTypeOptions = [
    { id: 1, name: 'Bad Payment' },
    { id: 2, name: 'On-time Payment' },
    { id: 3, name: 'Delayed Payment' }
  ];

  paymentModeOptions = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Current Account' },
    // { id: 3, name: 'UPI' },
    // { id: 4, name: 'NEFT' },
    // { id: 5, name: 'RTGS' },
    // { id: 6, name: 'IMPS' },
    // { id: 7, name: 'Cheque' },
    // { id: 8, name: 'Demand Draft' },
    // { id: 9, name: 'Others' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
       private dialog: MatDialog, // Inject MatDialog
     private router: Router,
  ) {
    this.paymentForm = this.fb.group({
      client: ['', Validators.required],
      invoiceGenerationDate: ['', Validators.required],
      actualInvoiceValue: ['', Validators.required],
      adjustedInvoiceValue: ['', Validators.required],
      dueDate: ['', Validators.required],
      receivedDate: [''],
      paymentStatus: ['', Validators.required],
      paymentType: ['', Validators.required],
      paymentMode: ['', Validators.required],
      followUps: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('payment');
    const date = this.route.snapshot.queryParamMap.get('date');

    if (id && date) {
      this.paymentId = +id;
      this.selectedDate = date;
      this.getPaymentDetails(+id, date);
    }
  }

  get followUps() {
    return this.paymentForm.get('followUps') as FormArray;
  }

  addFollowUp() {
    this.followUps.push(this.fb.group({
      followUpDate: ['', Validators.required],
      followUpDetails: ['', Validators.required]
    }));
    this.datePickerRefs.push(`dp${this.followUps.length - 1}`); // placeholder
  }
  
  removeFollowUp(index: number) {
    this.followUps.removeAt(index);
    this.datePickerRefs.splice(index, 1);
  }
  

  getPaymentDetails(id: number, date: string) {
    this.employeesService.GetPaymentCollection(date).subscribe((res: any[]) => {
      const data = res.find(x => x.id === id);
      if (data) {
        this.paymentForm.patchValue({
          client: data.organizationName,
          invoiceGenerationDate: data.date?.split('T')[0],
          actualInvoiceValue: data.amount || data.totalAmount,
          adjustedInvoiceValue: data.adjustedAmount || 0,
          dueDate: data.dueDate?.includes('0001-01-01') ? '' : data.dueDate?.split('T')[0],
          receivedDate: data.paymentDate?.includes('0001-01-01') ? '' : data.paymentDate?.split('T')[0],
          paymentStatus: data.paymentStatus,
          paymentType: data.paymentType,
          paymentMode: data.paymentMode
        });
  
        // Now fetch followups using invoice number
        this.employeesService.GetPaymentFollowup(this.paymentId).subscribe((followups: any[]) => {
          const followUpsArray = this.paymentForm.get('followUps') as FormArray;
          followUpsArray.clear(); // Clear old ones
  
          if (Array.isArray(followups) && followups.length > 0) {
            followups.forEach((followUp: any) => {
              followUpsArray.push(this.fb.group({
                followUpDate: followUp.followupDate?.includes('0001-01-01') ? '' : followUp.followupDate?.split('T')[0],
                followUpDetails: followUp.remarks || ''
              }));
            });
          } else {
            this.addFollowUp(); // Add one empty
          }
        });
      }
    });
  }
    // Utility function to format date as YYYY-MM-DD
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  

  submitForm() {
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
    // after successful update
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'paymentcollection';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
  
      const payload = {
        id: this.paymentId, // Set from query param in ngOnInit
        paymentDate: this.formatDate(new Date(this.paymentForm.get('receivedDate')?.value || '')),
        paymentMode: formValue.paymentMode,
        paymentType: formValue.paymentType,
        paymentStatus: formValue.paymentStatus,
        paymentFollowUps: formValue.followUps.map((f: any) => ({
          followupDate: this.formatDate(new Date(f.followUpDate)),
          remarks: f.followUpDetails,
        })),
      };
      this.employeesService.UpdateInvoicePaymentFollwUp(payload).subscribe({
        next: (res) => {
          console.log('Update Success:', res);
          this.openAlertDialog('Success', 'Payment follow-up updated Successfully!');
          this.router.navigate(['/home/employees/payment-tabs'], {
            queryParams: {
              tab,
              date
            }
          }); 
        },
        error: (err) => {
          console.error('Update Failed:', err);
          this.openAlertDialog('Error', err || 'Unexpected response. Please try again.');
        },
      });
    } else {
      console.log('Form is invalid');
      alert('Please fill all required fields correctly.');
    }
  }
  goBack(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'paymentcollection';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    this.router.navigate(['/home/employees/payment-tabs'], {
      queryParams: {
        tab,
        date
      }
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
