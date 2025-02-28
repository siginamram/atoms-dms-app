import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-payment-collection',
  standalone:false,
  templateUrl: './add-payment-collection.component.html',
  styleUrls: ['./add-payment-collection.component.css']
})
export class AddPaymentCollectionComponent {
  paymentForm: FormGroup;

  paymentStatusOptions: string[] = ['Paid', 'Pending', 'Partial Payment'];
  paymentTypeOptions: string[] = ['Bad Payment', 'On-time Payment', 'Delayed Payment', 'Partial Payment'];
  paymentModeOptions: string[] = [
    'Cash',
    'Net Banking',
    'UPI',
    'NEFT',
    'RTGS',
    'IMPS',
    'Cheque',
    'Demand Draft',
    'Others'
  ];
  

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      client: ['', Validators.required],
      invoiceGenerationDate: ['', Validators.required],
      actualInvoiceValue: ['', Validators.required],
      adjustedInvoiceValue: ['', Validators.required],
      dueDate: ['', Validators.required],
      receivedDate: [''],
      paymentStatus: ['', Validators.required],
      paymentType: ['', Validators.required],
      paymentMode:['', Validators.required],
      followUps: this.fb.array([]),
    });

    this.addFollowUp(); // Add at least one follow-up field by default
  }

  get followUps() {
    return this.paymentForm.get('followUps') as FormArray;
  }

  addFollowUp() {
    this.followUps.push(this.fb.group({
      followUpDate: ['', Validators.required],
      followUpDetails: ['', Validators.required]
    }));
  }

  removeFollowUp(index: number) {
    this.followUps.removeAt(index);
  }

  submitForm() {
    if (this.paymentForm.valid) {
      console.log('Payment Follow-up Data:', this.paymentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
