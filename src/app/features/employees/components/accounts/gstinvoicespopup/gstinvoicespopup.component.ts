import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EmployeesService } from '../../../services/employees.service';

@Component({
  selector: 'app-gstinvoicespopup',
  standalone: false,
  templateUrl: './gstinvoicespopup.component.html',
  styleUrls: ['./gstinvoicespopup.component.css']
})
export class GstinvoicespopupComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientGST: ['', Validators.required],
      invoiceDate: ['', Validators.required],
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
  }

  ngOnInit(): void {
    const invoiceParam = this.route.snapshot.queryParamMap.get('invoice');
    if (invoiceParam) {
      const invoiceObj = typeof invoiceParam === 'string' ? JSON.parse(invoiceParam) : invoiceParam;
      this.invoiceId = invoiceObj?.id || invoiceObj;
    }

    if (this.invoiceId) {
      this.employeesService.GetInvoiceDetailsById(this.invoiceId).subscribe((res: any) => {
        this.invoiceForm.patchValue({
          clientName: res.organizationName || '',
          clientGST: res.gstNumber || '',
          invoiceDate: res.date?.split('T')[0] || '',
          clientAddress: res.address || '',
          gstStateCode: res.gstStateCode || '',
          serviceOpted: res.serviceOpted || '',
          basePackage: res.amount || 0,
          adjustedPackage: res.adjustedAmount || 0,
          adBudget: res.adBudget || 0,
          includeAdBudget: res.includeAdBudget || false,
          gstPercentage: res.gstPercentage || 18,
          sacCode: res.sacCode || '',
          totalInvoiceValue: res.totalAmount || 0,
          totalInvoiceValueWords: '' // you can convert it if needed
        });

        const itemsArray = this.invoiceForm.get('items') as FormArray;
        itemsArray.clear();

        if (res.invoiceItems?.length) {
          res.invoiceItems.forEach((item: any) => {
            itemsArray.push(this.fb.group({
              itemDescription: [item.itemDescription || '', Validators.required],
              sacCode: [item.sacCode || '', Validators.required],
              qty: [item.quantity || 1, Validators.required],
              rate: [item.rate || 0, Validators.required],
              amount: [item.amount || 0, Validators.required],
              gst: [18, Validators.required],
              total: [item.totalAmount || 0]
            }));
          });
        } else {
          this.addItem();
        }
      });
    }
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
      gst: [0, Validators.required],
      total: [0]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  saveInvoice() {
    console.log("Invoice Data:", this.invoiceForm.value);
  }

  cancel() {
    this.router.navigate(['/home/employees/payment-tabs']);
  }

  goBack(): void {
    this.router.navigate(['/home/employees/payment-tabs']);
  }
}
