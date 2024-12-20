import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-convert-statu-edit',
  templateUrl: './sales-convert-statu-edit.component.html',
  styleUrls: ['./sales-convert-statu-edit.component.css'],
})
export class SalesConvertStatuEditComponent implements OnInit {
  progressForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.progressForm = this.fb.group({
      clientCategory: ['', Validators.required],
      operationsManager: ['', Validators.required],
      operationsLead: ['', Validators.required],
      contactNumberManager: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contactNumberLead: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      ktStatus: ['', Validators.required],
      ktDate: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      advanceDate: [''],
      slaUpload: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
    }
  }

  onSubmit() {
    if (this.progressForm.valid) {
      console.log('Form Data:', this.progressForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
