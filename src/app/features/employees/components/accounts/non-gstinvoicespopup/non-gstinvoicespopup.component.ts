import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-non-gstinvoicespopup',
 standalone:false,
  templateUrl: './non-gstinvoicespopup.component.html',
  styleUrl: './non-gstinvoicespopup.component.css'
})
export class NonGstinvoicespopupComponent {
  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientAddress: ['', Validators.required],
      serviceOpted: ['', Validators.required],
      invoiceDate:['', Validators.required],
      basePackage: [0, Validators.required],
      adjustedPackage: [0, Validators.required],
      adBudget: [0],
      adjustedAdBudget: [0],
      includeAdBudget: [false],
      gstPercentage: [18, Validators.required],
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
      qty: [1, Validators.required],
      rate: [0, Validators.required],
      amount: [0, Validators.required],
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
    console.log("Invoice Editing Cancelled");
  }
}
