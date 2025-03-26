import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.service';
interface InvoiceItem {
  itemDescription: string;
  quantity: number;
  rate: number;
  amount: number;
}

@Component({
  selector: 'app-non-gstinvoicespopup',
  standalone: false,
  templateUrl: './non-gstinvoicespopup.component.html',
  styleUrl: './non-gstinvoicespopup.component.css'
})
export class NonGstinvoicespopupComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeesService: EmployeesService
  ) {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientAddress: ['', Validators.required],
      serviceOpted: ['', Validators.required],
      invoiceDate: ['', Validators.required],
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
  }

  ngOnInit(): void {
    const invoiceParam = this.route.snapshot.queryParamMap.get('invoice');
    console.log(invoiceParam);
    if (invoiceParam) {
      const invoiceObj = typeof invoiceParam === 'string' ? JSON.parse(invoiceParam) : invoiceParam;
      const invoiceId = invoiceObj?.id || invoiceObj;
      this.invoiceId = invoiceId;

      if (invoiceId) {
        console.log('invoiceParam',invoiceId);
        this.loadInvoiceData(invoiceId);
      }
    } else {
      this.addItem();
    }
  }

  get items(): FormArray {
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

  loadInvoiceData(invoiceId: number): void {
    this.employeesService.GetInvoiceDetailsById(invoiceId).subscribe((data: any) => {
      this.invoiceForm.patchValue({
        clientName: data.organizationName,
        clientAddress: data.address,
        serviceOpted: data.serviceOpted,
        invoiceDate: data.date?.split('T')[0],
        basePackage: data.amount || 0,
        adjustedPackage: data.adjustedAmount || 0,
        adBudget: data.adBudget || 0,
        includeAdBudget: data.includeAdBudget,
        totalInvoiceValue: data.totalAmount || 0,
        totalInvoiceValueWords: this.convertNumberToWords(data.totalAmount || 0)
      });

      this.items.clear();
      if (Array.isArray(data.invoiceItems) && data.invoiceItems.length > 0) {
        data.invoiceItems.forEach((item: InvoiceItem) => {
          this.items.push(this.fb.group({
            itemDescription: item.itemDescription,
            qty: item.quantity,
            rate: item.rate,
            amount: item.amount
          }));
        });
      } else {
        this.addItem();
      }
    });
  }

  convertNumberToWords(amount: number): string {
    return amount.toLocaleString() + ' Rupees';
  }

  saveInvoice() {
    console.log("Invoice Data:", this.invoiceForm.value);
    // API call to save or update can go here
  }

  cancel() {
    this.router.navigate(['/home/employees/non-gst-invoices']);
  }

  goBack(): void {
    this.router.navigate(['/home/employees/non-gst-invoices']); 
  }
}
