
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-employee-other-details',
  standalone:false,
  templateUrl: './employee-other-details.component.html',
  styleUrls: ['./employee-other-details.component.css']
})
export class EmployeeOtherDetailsComponent implements OnInit {
  documentForm!: FormGroup;
  bankForm!: FormGroup;
  selectedTab: string = 'documents';
  employeeId: number = 0;
  userId: number = 0;
  empName: string = '';
  formSubmitted: boolean= false;

  constructor(private fb: FormBuilder,
     private empService: EmployeesService,
     private route: ActivatedRoute,
     private dialog: MatDialog,
     private router: Router
) {}

  onTabChange(index: number): void {
    this.selectedTab = index === 0 ? 'documents' : 'bank';
  }
  
  ngOnInit(): void {
    this.employeeId = parseInt(localStorage.getItem('EmployeeData') || '0', 10);

    this.documentForm = this.fb.group({
      aadharNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{12}$/)
        ]
      ],
      panNumber: [
        '', [Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]
      ],
      passportNumber: [ '', Validators.pattern(/^[A-PR-WY][0-9]{7}$/)],
      aadharCardUrl: [''],
      panCardUrl: [''],
      passportCardUrl: [''],
      employeeAgreementUrl: [''],
      offerLetterUrl: [''],
      aadharDocument: [null],
      panDocument: [null],
      passportDocument: [null],
      agreementDocument: [null],
      offerLetterDocument: [null],
    });

    this.bankForm = this.fb.group({
      accountHolderName: ['', Validators.required],
      accountName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9,18}$/)
        ]
      ],
      ifsc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)
        ]
      ],
      accountType: ['', Validators.required],
    });
    this.route.queryParams.subscribe((params) => {
      this.employeeId = params['empid'] ? +params['empid'] : parseInt(localStorage.getItem('EmployeeData') || '0', 10);
      this.empName = params['empName'] || '';

      if (this.employeeId) {
        this.loadDocumentData();
        this.loadBankData();
      }
    });

  }

  loadDocumentData(): void {
    this.empService.GetDocumentDetails(this.employeeId).subscribe((data) => {
      if (data) this.documentForm.patchValue(data);
    });
  }

  loadBankData(): void {
    this.empService.GetEmployeeBankAccount(this.employeeId).subscribe((data) => {
      if (data) this.bankForm.patchValue(data);
    });
  }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.documentForm.get(controlName)?.setValue({ fileName: file.name, fileBytes: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  saveDocumentDetails(): void {
    this.formSubmitted = true;
  
    if (
      this.documentForm.invalid ||
      !this.documentForm.value.aadharDocument ||
      !this.documentForm.value.panDocument ||
      !this.documentForm.value.agreementDocument ||
      !this.documentForm.value.offerLetterDocument
    ) {
      this.documentForm.markAllAsTouched();
      return;
    }
  
    const payload = {
      employeeId: this.employeeId,
      updatedBy: this.employeeId,
      ...this.documentForm.value
    };
  
    this.empService.UpdateEmployeeDocumentDetails(payload).subscribe(() => {
      //alert('Document details updated successfully');
      this.openAlertDialog('Success', 'Document details updated successfully!');
      this.router.navigate([`/home/employees/employee-dashboard`], {
        queryParams: {
          empid: this.employeeId,
          empName:this.empName
        }
      });
      this.formSubmitted = false;
    });
  }
  

  saveBankDetails(): void {
    this.formSubmitted = true;
  
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }
  
    const raw = this.bankForm.value;
    const payload = {
      employeeId: this.employeeId,
      ...this.bankForm.value
    };
    // const payload = {
    //   bankDetails: {
    //     employeeId: this.employeeId,
    //     accountHolderName: raw.accountHolderName,
    //     accountName: raw.accountName,
    //     branchName: raw.branchName,
    //     ifsc: raw.ifsc,
    //     accountNumber: raw.accountNumber 
    //   }
    // };
  
    this.empService.updateEmployeeBankAccount(payload).subscribe(() => {
      //alert('Bank details updated successfully');
      this.openAlertDialog('Success', 'Bank details updated successfully!');
      this.router.navigate([`/home/employees/employee-dashboard`], {
        queryParams: {
          empid: this.employeeId,
          empName:this.empName
        }
      });
      this.formSubmitted = false;
    });
  }
  
   openAlertDialog(title: string, message: string): void {
      this.dialog.open(AlertDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          type: title.toLowerCase()
        }
      });
    }
  
    goBack(): void {
      this.router.navigate(['/home/employees/employee-dashboard'], {
        queryParams: {
          empid: this.employeeId,
          empName: this.empName
        }
      });
    }
}
