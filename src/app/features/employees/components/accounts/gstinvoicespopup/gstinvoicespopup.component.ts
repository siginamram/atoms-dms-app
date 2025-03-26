import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gstinvoicespopup',
  standalone:false,
  templateUrl: './gstinvoicespopup.component.html',
  styleUrls: ['./gstinvoicespopup.component.css']
})
export class GstinvoicespopupComponent {
  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder,  private router: Router,) {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientGST: ['', Validators.required],
      invoiceDate:['', Validators.required],
      clientAddress: ['', Validators.required],
      gstStateCode: ['', Validators.required],
      serviceOpted: ['', Validators.required],
      basePackage: [0, Validators.required],
      adjustedPackage: [0, Validators.required],
      adBudget: [0],
      adjustedAdBudget: [0],
      includeAdBudget: [false],
      gstPercentage: [18, Validators.required],
      sacCode: ['', Validators.required],
      items: this.fb.array([]),
      totalInvoiceValue: [0],
      totalInvoiceValueWords: ['']
    });

    this.addItem(); // Add at least one item row
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({
      itemDescription: ['', Validators.required],
      sacCode: ['', Validators.required],
      qty: [1, Validators.required],
      rate: [0, Validators.required],
      amount: [0, Validators.required],
      gst: [18, Validators.required],
      total: [0]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTotal() {
    let total = 0;
    this.items.controls.forEach((item: any) => {
      const qty = item.get('qty').value;
      const rate = item.get('rate').value;
      const gst = item.get('gst').value;
      const itemTotal = (qty * rate) + ((qty * rate) * gst / 100);
      item.get('total').setValue(itemTotal);
      total += itemTotal;
    });

    this.invoiceForm.get('totalInvoiceValue')?.setValue(total);
    this.invoiceForm.get('totalInvoiceValueWords')?.setValue(this.convertNumberToWords(total));
    
  }

  convertNumberToWords(amount: number): string {
    // Simple logic to convert numbers to words (could be replaced with an actual converter)
    return amount.toLocaleString() + " Rupees";
  }

  saveInvoice() {
    console.log("Invoice Data:", this.invoiceForm.value);
  }

  cancel() {
    this.router.navigate(['/home/employees/non-gst-invoices']);
  }

  goBack(): void {
    this.router.navigate(['/home/employees/gst-invoices']); 
  }
}
