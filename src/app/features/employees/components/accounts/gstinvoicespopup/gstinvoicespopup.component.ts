import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmployeesService } from '../../../services/employees.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Client {
  organizationName: string;
  address?: string;
  gstNumber?: string;
  stateCode?: string;
}

@Component({
  selector: 'app-gstinvoicespopup',
  standalone: false,
  templateUrl: './gstinvoicespopup.component.html',
  styleUrls: ['./gstinvoicespopup.component.css']
})
export class GstinvoicespopupComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: any;
  existingClientControl = new FormControl<Client | string | null>(null);
  clients: Client[] = [];
  filteredClients!: Observable<Client[]>;

  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private dialog: MatDialog, // Inject MatDialog
  ) {
    this.invoiceForm = this.fb.group({
      clientType: ['new'], // ✅ added here
      clientName: ['', Validators.required],
      clientGST: [''],
      invoiceDate: ['', Validators.required],
      clientAddress: [''],
      gstStateCode: [''],
      serviceOpted: ['', Validators.required],
      Amount: ['', Validators.required],
      PaymentMode: ['', Validators.required],
      servicetype: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const invoiceParam = this.route.snapshot.queryParamMap.get('invoice');
    if (invoiceParam) {
      const invoiceObj = typeof invoiceParam === 'string' ? JSON.parse(invoiceParam) : invoiceParam;
      this.invoiceId = invoiceObj?.id || invoiceObj;
    }

    this.fetchAllClients();

  this.filteredClients = this.existingClientControl.valueChanges.pipe(
  startWith(''),
  map((value: Client | string | null) => {
    const name = typeof value === 'string' ? value : value?.organizationName || '';
    return this.filterClients(name);
  })
);

  }

  get clientType(): 'existing' | 'new' {
    return this.invoiceForm.get('clientType')?.value;
  }

  fetchAllClients(): void {
    this.employeesService.getClientsByUser(this.userId).subscribe({
      next: (response: Client[]) => {
        this.clients = response;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  filterClients(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client =>
      client.organizationName.toLowerCase().includes(filterValue)
    );
  }

 displayFn(client: Client | string | null): string {
  return typeof client === 'object' && client !== null ? client.organizationName : client || '';
}


  onClientSelected(client: Client | null): void {
    if (client && typeof client === 'object') {
      this.invoiceForm.patchValue({
        clientName: client.organizationName,
        clientAddress: client.address || '',
        clientGST: client.gstNumber || '',
        gstStateCode: client.stateCode || ''
      });
    }
  }

  onServiceTypeChange(): void {
    const type = this.invoiceForm.get('servicetype')?.value;
    if (type !== 'GST') {
      this.invoiceForm.get('clientGST')?.reset();
      this.invoiceForm.get('gstStateCode')?.reset();
    }
  }

saveInvoice(): void {
  if (this.clientType === 'existing') {
    const selectedClient = this.existingClientControl.value;
    if (selectedClient) {
      const clientName =
        typeof selectedClient === 'object'
          ? selectedClient.organizationName
          : selectedClient;
      this.invoiceForm.get('clientName')?.setValue(clientName);
    }
  }

  if (this.invoiceForm.invalid) {
    console.warn('Form is invalid.');
    return;
  }

  const formValues = this.invoiceForm.value;
  const isGSTApplicable = formValues.servicetype === 'GST';

  const payload = {
    id: 0,
    organizationName: formValues.clientName,
    address: formValues.clientAddress ||'' ,
    serviceOpted: formValues.serviceOpted,
    gstNumber: formValues.clientGST || '',
    date: this.formatDate(new Date(this.invoiceForm.get('invoiceDate')?.value || '')),
    invoiceNo: '', // If needed, generate or leave empty
    amount: parseFloat(formValues.Amount),
    totalAmount: 0, // Will be calculated in SP
    dueDate: formValues.invoiceDate,
    adjustedAmount: 0,
    includeAdBudget: false,
    isGSTApplicable: isGSTApplicable,
    isISTApplicable: false,
    cgstAmount: 0,
    sgstAmount: 0,
    istAmount: 0,
    adBudget: 0,
    createdBy: this.userId,
    stateCode: parseInt(formValues.gstStateCode) || 0,
    invoiceItems: [
      {
        invoiceId: 0,
        itemDescription: formValues.serviceOpted,
        quantity: 1,
        rate: parseFloat(formValues.Amount),
        amount: parseFloat(formValues.Amount),
        sacCode: 0,
        isGSTApplicable: isGSTApplicable,
        cgstAmount: 0,
        sgstAmount: 0,
        istAmount: 0,
        totalAmount: 0
      }
    ]
  };

  this.employeesService.AddNonDMClient(payload).subscribe({
    next: (response) => {
      console.log('Invoice saved:', response);
      //alert('Invoice saved successfully!');
       this.openAlertDialog('Success', 'Invoice saved successfully!');
      this.cancel();
    },
    error: (err) => {
      console.error('Error saving invoice:', err);
      //alert('Failed to save invoice.');
        this.openAlertDialog('Error', err || 'Unexpected response. Please try again.');
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

  cancel(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'ads';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    this.router.navigate(['/home/employees/payment-tabs'], {
      queryParams: { tab, date }
    });
  }

  goBack(): void {
    this.cancel();
  }
}
